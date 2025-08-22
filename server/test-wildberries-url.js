const ReviewsService = require('./services/ReviewsService.js');

// Тестируем формирование URL отзывов Wildberries
function testWildberriesUrl() {
    const reviewsService = new ReviewsService();
    
    // Тестовые URL товаров
    const testUrls = [
        'https://www.wildberries.ru/catalog/472575537/detail.aspx',
        'https://www.wildberries.ru/catalog/123456789/detail.aspx',
        'https://www.wildberries.ru/catalog/987654321/detail.aspx'
    ];
    
    console.log('🧪 Тестирование формирования URL отзывов Wildberries:\n');
    
    testUrls.forEach((productUrl, index) => {
        try {
            const reviewsUrl = reviewsService.getWildberriesReviewsUrl(productUrl);
            console.log(`✅ Тест ${index + 1}:`);
            console.log(`   Товар: ${productUrl}`);
            console.log(`   Отзывы: ${reviewsUrl}`);
            console.log('');
        } catch (error) {
            console.log(`❌ Тест ${index + 1} - Ошибка: ${error.message}`);
            console.log(`   Товар: ${productUrl}`);
            console.log('');
        }
    });
    
    // Проверяем правильный формат
    console.log('📋 Ожидаемый формат:');
    console.log('   https://www.wildberries.ru/catalog/{id}/feedbacks');
    console.log('');
    console.log('🔗 Пример из вашего сообщения:');
    console.log('   https://www.wildberries.ru/catalog/472575537/feedbacks');
}

// Запускаем тест
testWildberriesUrl();
