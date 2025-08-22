const ReviewsService = require('./services/ReviewsService');

async function testSmoothScroll() {
    console.log('🧪 Тестирование плавного скроллинга...');
    
    const reviewsService = new ReviewsService();
    
    // Тестируем на реальном URL (замените на актуальный)
    const testUrl = 'https://www.ozon.ru/product/test-product';
    
    try {
        console.log('📝 Начинаем парсинг отзывов...');
        const reviews = await reviewsService.getReviews(testUrl);
        console.log(`✅ Успешно получено ${reviews.length} отзывов`);
        
        if (reviews.length > 0) {
            console.log('📋 Пример отзыва:');
            console.log(JSON.stringify(reviews[0], null, 2));
        }
    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error.message);
    }
}

// Запускаем тест только если файл вызван напрямую
if (require.main === module) {
    testSmoothScroll();
}

module.exports = { testSmoothScroll };
