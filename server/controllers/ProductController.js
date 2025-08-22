const { DEFAULTS, SORT_OPTIONS } = require('../constants');

class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

    /**
     * Обрабатывает GET запрос для получения продуктов
     * @param {Object} request - объект запроса
     * @param {Object} response - объект ответа
     */
    async getProducts(request, response) {
        try {
            const { search, sortBy } = this.extractQueryParams(request);
            
            if (!this.isValidSearchQuery(search)) {
                return this.sendEmptyResponse(response);
            }

            const products = await this.productService.getProductsFromName(search, sortBy);
            this.sendSuccessResponse(response, products);
        } catch (error) {
            this.sendErrorResponse(response, error);
        }
    }

    /**
     * Извлекает параметры из query string
     * @param {Object} request - объект запроса
     * @returns {Object} объект с параметрами
     */
    extractQueryParams(request) {
        return {
            search: request.query.search,
            sortBy: request.query.sortBy || DEFAULTS.SORT_BY
        };
    }

    /**
     * Проверяет валидность поискового запроса
     * @param {string} search - поисковый запрос
     * @returns {boolean} результат валидации
     */
    isValidSearchQuery(search) {
        return search && search.trim().length > 0;
    }

    /**
     * Отправляет пустой ответ
     * @param {Object} response - объект ответа
     */
    sendEmptyResponse(response) {
        response.json(DEFAULTS.EMPTY_ARRAY);
    }

    /**
     * Отправляет успешный ответ
     * @param {Object} response - объект ответа
     * @param {Array} data - данные для отправки
     */
    sendSuccessResponse(response, data) {
        response.json(data);
    }

    /**
     * Отправляет ответ с ошибкой
     * @param {Object} response - объект ответа
     * @param {Error} error - объект ошибки
     */
    sendErrorResponse(response, error) {
        console.error('Controller error:', error);
        response.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

module.exports = ProductController;
