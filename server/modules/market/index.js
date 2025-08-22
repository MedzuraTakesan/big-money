const { MARKETPLACES, DEFAULTS } = require('../../constants');
const ProductSortService = require('../../services/ProductSortService');
const ServiceFactory = require('../../factories/ServiceFactory');

// Создаем экземпляры сервисов
const productService = ServiceFactory.createProductService();
const performanceService = ServiceFactory.getPerformanceService();

/**
 * Получает продукты по названию с параллельным парсингом
 * @param {string} productName - название продукта
 * @param {string} sortBy - критерий сортировки
 * @returns {Promise<Array>} массив продуктов
 */
const getProductsFromName = async (productName, sortBy = DEFAULTS.SORT_BY) => {
    return await productService.getProductsFromName(productName, sortBy);
};

/**
 * Получает продукты по названию с последовательным парсингом (fallback)
 * @param {string} productName - название продукта
 * @param {string} sortBy - критерий сортировки
 * @returns {Promise<Array>} массив продуктов
 */
const getProductsFromNameSequential = async (productName, sortBy = DEFAULTS.SORT_BY) => {
    return await productService.performSequentialSearch(productName, sortBy);
};

/**
 * Перемешивает продукты по маркетплейсам
 * @param {Array} products - массив продуктов
 * @returns {Array} перемешанный массив
 */
const interleaveProductsByMarketplace = (products) => {
    return productService.interleaveProductsByMarketplace(products);
};

/**
 * Группирует продукты по маркетплейсам
 * @param {Array} products - массив продуктов
 * @returns {Object} объект с группированными продуктами
 */
const groupProductsByMarketplace = (products) => {
    return productService.groupProductsByMarketplace(products);
};

/**
 * Получает статистику производительности
 * @returns {Object} объект со статистикой
 */
const getPerformanceStats = () => {
    return performanceService.getPerformanceStats();
};

/**
 * Очищает кэш
 */
const clearCache = () => {
    performanceService.clearCache();
};

module.exports = {
    getProductsFromName,
    getProductsFromNameSequential,
    interleaveProductsByMarketplace,
    groupProductsByMarketplace,
    getPerformanceStats,
    clearCache
};