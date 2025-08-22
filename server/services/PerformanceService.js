const { ERROR_MESSAGES } = require('../constants');

class PerformanceService {
    /**
     * Получает статистику производительности
     * @returns {Object} объект со статистикой
     */
    static getPerformanceStats() {
        try {
            const { browserManager } = require('../modules/market/helpers/parser/browser-manager.js');
            const { cache } = require('../modules/market/helpers/parser/optimizations.js');
            
            return {
                browserStats: browserManager.getStats(),
                cacheSize: cache.size
            };
        } catch (error) {
            console.error('Error getting performance stats:', error);
            return {
                browserStats: {},
                cacheSize: 0
            };
        }
    }

    /**
     * Очищает кэш
     */
    static clearCache() {
        try {
            const { cleanupCache } = require('../modules/market/helpers/parser/optimizations.js');
            cleanupCache();
            console.log(ERROR_MESSAGES.CACHE_CLEARED);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
}

module.exports = PerformanceService;
