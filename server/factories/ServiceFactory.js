const ProductService = require('../services/ProductService');
const ProductController = require('../controllers/ProductController');
const PerformanceService = require('../services/PerformanceService');

class ServiceFactory {
    /**
     * Создает экземпляр ProductService с внедренными зависимостями
     * @returns {ProductService} экземпляр ProductService
     */
    static createProductService() {
        const marketplaceParsers = {
            ozon: require('../modules/market/ozon/index.js'),
            wildberries: require('../modules/market/wildberries/index.js')
        };
        
        return new ProductService(marketplaceParsers);
    }

    /**
     * Создает экземпляр ProductController с внедренными зависимостями
     * @returns {ProductController} экземпляр ProductController
     */
    static createProductController() {
        const productService = this.createProductService();
        return new ProductController(productService);
    }

    /**
     * Получает экземпляр PerformanceService
     * @returns {PerformanceService} экземпляр PerformanceService
     */
    static getPerformanceService() {
        return PerformanceService;
    }
}

module.exports = ServiceFactory;
