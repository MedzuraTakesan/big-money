const { SORT_OPTIONS, PRODUCT_FIELDS } = require('../constants');

class ProductSortService {
    /**
     * Сортирует продукты по указанному критерию
     * @param {Array} products - массив продуктов для сортировки
     * @param {string} sortBy - критерий сортировки
     * @returns {Array} отсортированный массив продуктов
     */
    static sortProducts(products, sortBy = SORT_OPTIONS.REVIEWS) {
        return [...products].sort((a, b) => {
            switch (sortBy) {
                case SORT_OPTIONS.REVIEWS:
                    return this.compareByReviews(a, b);
                case SORT_OPTIONS.PRICE:
                    return this.compareByPrice(a, b);
                case SORT_OPTIONS.NAME:
                    return this.compareByName(a, b);
                default:
                    return this.compareByReviews(a, b);
            }
        });
    }

    /**
     * Сравнивает продукты по количеству отзывов
     * @param {Object} a - первый продукт
     * @param {Object} b - второй продукт
     * @returns {number} результат сравнения
     */
    static compareByReviews(a, b) {
        const reviewsA = a[PRODUCT_FIELDS.REVIEWS_COUNT] || 0;
        const reviewsB = b[PRODUCT_FIELDS.REVIEWS_COUNT] || 0;
        return reviewsB - reviewsA; // По убыванию
    }

    /**
     * Сравнивает продукты по цене
     * @param {Object} a - первый продукт
     * @param {Object} b - второй продукт
     * @returns {number} результат сравнения
     */
    static compareByPrice(a, b) {
        const priceA = a[PRODUCT_FIELDS.SALE] || a[PRODUCT_FIELDS.PRICE] || 0;
        const priceB = b[PRODUCT_FIELDS.SALE] || b[PRODUCT_FIELDS.PRICE] || 0;
        return priceA - priceB; // По возрастанию
    }

    /**
     * Сравнивает продукты по названию
     * @param {Object} a - первый продукт
     * @param {Object} b - второй продукт
     * @returns {number} результат сравнения
     */
    static compareByName(a, b) {
        const nameA = a[PRODUCT_FIELDS.NAME] || '';
        const nameB = b[PRODUCT_FIELDS.NAME] || '';
        return nameA.localeCompare(nameB);
    }
}

module.exports = ProductSortService;
