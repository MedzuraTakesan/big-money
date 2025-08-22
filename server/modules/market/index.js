const ozon = require('./ozon/index.js');
const wildberries = require('./wildberries/index.js');
const { parallelOptimizedSearch } = require('./helpers/parser/optimizations.js');

const getProductsFromName = async (productName, sortBy = 'reviews') => {
    const startTime = Date.now();
    
    // Используем параллельный парсинг для ускорения
    const marketplaces = ['ozon', 'wildberries'];
    const parsers = [ozon, wildberries];
    const urls = [
        `https://www.ozon.ru/search/?text=${encodeURIComponent(productName)}`,
        `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(productName)}`
    ];

    try {
        // Параллельный парсинг с оптимизацией
        const allProducts = await parallelOptimizedSearch(parsers, urls, marketplaces, productName);
        
        // Сортируем по выбранному критерию
        const sortedProducts = allProducts.sort((a, b) => {
            switch (sortBy) {
                case 'reviews':
                    const reviewsA = a.reviewsCount || 0;
                    const reviewsB = b.reviewsCount || 0;
                    return reviewsB - reviewsA;
                case 'price':
                    const priceA = a.sale || a.price || 0;
                    const priceB = b.sale || b.price || 0;
                    return priceA - priceB;
                case 'name':
                    return (a.name || '').localeCompare(b.name || '');
                default:
                    const defaultReviewsA = a.reviewsCount || 0;
                    const defaultReviewsB = b.reviewsCount || 0;
                    return defaultReviewsB - defaultReviewsA;
            }
        });

        const endTime = Date.now();
        console.log(`Общее время выполнения: ${endTime - startTime}ms`);
        console.log(`Найдено товаров: ${sortedProducts.length}`);

        return sortedProducts;
    } catch (error) {
        console.error('Error in parallel search:', error);
        
        // Fallback к старому методу если параллельный парсинг не сработал
        console.log('Falling back to sequential search...');
        return await getProductsFromNameSequential(productName, sortBy);
    }
};

// Старый метод для fallback
const getProductsFromNameSequential = async (productName, sortBy = 'reviews') => {
    const marketplaces = [ozon, wildberries];
    
    const results = await Promise.allSettled(
        marketplaces.map(marketplace => marketplace.search(productName))
    );

    const allProducts = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);

    // Сортируем по выбранному критерию
    const sortedProducts = allProducts.sort((a, b) => {
        switch (sortBy) {
            case 'reviews':
                const reviewsA = a.reviewsCount || 0;
                const reviewsB = b.reviewsCount || 0;
                return reviewsB - reviewsA;
            case 'price':
                const priceA = a.sale || a.price || 0;
                const priceB = b.sale || b.price || 0;
                return priceA - priceB;
            case 'name':
                return (a.name || '').localeCompare(b.name || '');
            default:
                const defaultReviewsA = a.reviewsCount || 0;
                const defaultReviewsB = b.reviewsCount || 0;
                return defaultReviewsB - defaultReviewsA;
        }
    });

    return sortedProducts;
};

const interleaveProductsByMarketplace = (products) => {
    const productsByMarketplace = groupProductsByMarketplace(products);
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
};

const groupProductsByMarketplace = (products) => {
    return products.reduce((groups, product) => {
        const marketplace = product.marketplace;
        if (!groups[marketplace]) {
            groups[marketplace] = [];
        }
        groups[marketplace].push(product);
        return groups;
    }, {});
};

// Новый метод для получения статистики производительности
const getPerformanceStats = () => {
    const { browserManager } = require('./helpers/parser/browser-manager.js');
    return {
        browserStats: browserManager.getStats(),
        cacheSize: require('./helpers/parser/optimizations.js').cache.size
    };
};

// Новый метод для очистки кэша
const clearCache = () => {
    const { cleanupCache } = require('./helpers/parser/optimizations.js');
    cleanupCache();
    console.log('Cache cleared');
};

module.exports = {
    getProductsFromName,
    getProductsFromNameSequential,
    interleaveProductsByMarketplace,
    groupProductsByMarketplace,
    getPerformanceStats,
    clearCache
};