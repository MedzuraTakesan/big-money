const { MARKETPLACES, URL_TEMPLATES, ERROR_MESSAGES, LOG_MESSAGES } = require('../constants');
const ProductSortService = require('./ProductSortService');

class ProductService {
    constructor(marketplaceParsers) {
        this.marketplaceParsers = marketplaceParsers;
    }

    /**
     * Получает продукты по названию с параллельным парсингом
     * @param {string} productName - название продукта
     * @param {string} sortBy - критерий сортировки
     * @returns {Promise<Array>} массив продуктов
     */
    async getProductsFromName(productName, sortBy) {
        const startTime = Date.now();
        
        try {
            const allProducts = await this.performParallelSearch(productName);
            const sortedProducts = ProductSortService.sortProducts(allProducts, sortBy);
            
            this.logPerformance(startTime, sortedProducts.length);
            return sortedProducts;
        } catch (error) {
            console.error(ERROR_MESSAGES.PARALLEL_SEARCH_FAILED, error);
            return await this.performSequentialSearch(productName, sortBy);
        }
    }

    /**
     * Выполняет параллельный поиск по всем маркетплейсам
     * @param {string} productName - название продукта
     * @returns {Promise<Array>} массив продуктов
     */
    async performParallelSearch(productName) {
        const { parallelOptimizedSearch } = require('../modules/market/helpers/parser/optimizations.js');
        
        const marketplaces = [MARKETPLACES.OZON, MARKETPLACES.WILDBERRIES];
        const parsers = this.getParsers();
        const urls = this.buildSearchUrls(productName);

        return await parallelOptimizedSearch(parsers, urls, marketplaces, productName);
    }

    /**
     * Выполняет последовательный поиск (fallback)
     * @param {string} productName - название продукта
     * @param {string} sortBy - критерий сортировки
     * @returns {Promise<Array>} массив продуктов
     */
    async performSequentialSearch(productName, sortBy) {
        console.log(ERROR_MESSAGES.FALLBACK_TO_SEQUENTIAL);
        
        const results = await Promise.allSettled(
            this.marketplaceParsers.map(parser => parser.search(productName))
        );

        const allProducts = results
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value);

        return ProductSortService.sortProducts(allProducts, sortBy);
    }

    /**
     * Получает парсеры для маркетплейсов
     * @returns {Array} массив парсеров
     */
    getParsers() {
        return Object.values(this.marketplaceParsers);
    }

    /**
     * Строит URL для поиска по маркетплейсам
     * @param {string} productName - название продукта
     * @returns {Array} массив URL
     */
    buildSearchUrls(productName) {
        const encodedName = encodeURIComponent(productName);
        return [
            `${URL_TEMPLATES.OZON_SEARCH}${encodedName}`,
            `${URL_TEMPLATES.WILDBERRIES_SEARCH}${encodedName}`
        ];
    }

    /**
     * Логирует производительность поиска
     * @param {number} startTime - время начала
     * @param {number} productsCount - количество найденных продуктов
     */
    logPerformance(startTime, productsCount) {
        const endTime = Date.now();
        console.log(`${LOG_MESSAGES.EXECUTION_TIME} ${endTime - startTime}ms`);
        console.log(`${LOG_MESSAGES.PRODUCTS_FOUND} ${productsCount}`);
    }

    /**
     * Перемешивает продукты по маркетплейсам
     * @param {Array} products - массив продуктов
     * @returns {Array} перемешанный массив
     */
    interleaveProductsByMarketplace(products) {
        const productsByMarketplace = this.groupProductsByMarketplace(products);
        const marketplaceNames = Object.keys(productsByMarketplace);
        const maxLength = Math.max(...marketplaceNames.map(name => productsByMarketplace[name].length));
        
        const interleavedProducts = [];
        
        for (let i = 0; i < maxLength; i++) {
            marketplaceNames.forEach(marketplace => {
                if (productsByMarketplace[marketplace][i]) {
                    interleavedProducts.push(productsByMarketplace[marketplace][i]);
                }
            });
        }
        
        return interleavedProducts;
    }

    /**
     * Группирует продукты по маркетплейсам
     * @param {Array} products - массив продуктов
     * @returns {Object} объект с группированными продуктами
     */
    groupProductsByMarketplace(products) {
        return products.reduce((groups, product) => {
            const marketplace = product.marketplace;
            if (!groups[marketplace]) {
                groups[marketplace] = [];
            }
            groups[marketplace].push(product);
            return groups;
        }, {});
    }


}

module.exports = ProductService;
