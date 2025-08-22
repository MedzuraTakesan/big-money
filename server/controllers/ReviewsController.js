const ReviewsService = require('../services/ReviewsService');

class ReviewsController {
    constructor() {
        this.reviewsService = new ReviewsService();
    }

    /**
     * Обрабатывает GET запрос для получения отзывов
     * @param {Object} request - объект запроса
     * @param {Object} response - объект ответа
     */
    async getReviews(request, response) {
        console.log('📥 Получен запрос на /get-reviews');
        console.log('Query params:', request.query);
        
        try {
            const { url } = this.extractQueryParams(request);
            console.log('🔗 URL товара:', url);
            
            if (!this.isValidUrl(url)) {
                console.log('❌ Неверный URL товара');
                return this.sendErrorResponse(response, 'Неверный URL товара', 400);
            }

            console.log('✅ URL валиден, начинаем парсинг...');
            const reviews = await this.reviewsService.getReviews(url);
            console.log(`✅ Получено отзывов: ${reviews.length}`);
            
            this.sendSuccessResponse(response, reviews);
        } catch (error) {
            console.error('❌ Ошибка в контроллере:', error);
            this.sendErrorResponse(response, error.message, 500);
        }
    }

    /**
     * Извлекает параметры из query string
     * @param {Object} request - объект запроса
     * @returns {Object} объект с параметрами
     */
    extractQueryParams(request) {
        return {
            url: request.query.url
        };
    }

    /**
     * Проверяет валидность URL
     * @param {string} url - URL товара
     * @returns {boolean} результат валидации
     */
    isValidUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        
        // Проверяем, что URL содержит один из поддерживаемых маркетплейсов
        return url.includes('wildberries.ru') || 
               url.includes('wb.ru') || 
               url.includes('ozon.ru');
    }

    /**
     * Отправляет успешный ответ
     * @param {Object} response - объект ответа
     * @param {Array} data - данные для отправки
     */
    sendSuccessResponse(response, data) {
        response.json({
            success: true,
            data: data
        });
    }

    /**
     * Отправляет ответ с ошибкой
     * @param {Object} response - объект ответа
     * @param {string} message - сообщение об ошибке
     * @param {number} statusCode - код статуса
     */
    sendErrorResponse(response, message, statusCode = 500) {
        console.error('Reviews controller error:', message);
        response.status(statusCode).json({
            success: false,
            error: message
        });
    }
}

module.exports = ReviewsController;
