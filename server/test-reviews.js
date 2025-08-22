const ReviewsService = require('./services/ReviewsService');

async function testReviewsParser() {
    const reviewsService = new ReviewsService();
    
    console.log('🧪 Тестирование парсера отзывов...\n');
    
    // Тестовые URL (можно заменить на реальные)
    const testUrls = [
        // Wildberries
        'https://www.wildberries.ru/catalog/12345678/detail.aspx',
        // Ozon
        'https://www.ozon.ru/product/123456789/'
    ];
    
    for (const url of testUrls) {
        console.log(`📋 Тестируем URL: ${url}`);
        console.log(`🔍 Определяем маркетплейс...`);
        
        try {
            const marketplace = reviewsService.detectMarketplace(url);
            console.log(`✅ Маркетплейс: ${marketplace}`);
            
            const reviews = await reviewsService.getReviews(url);
            console.log(`✅ Получено отзывов: ${reviews.length}`);
            
            if (reviews.length > 0) {
                console.log('📝 Пример отзыва:');
                console.log(`   Автор: ${reviews[0].author}`);
                console.log(`   Рейтинг: ${reviews[0].rating}/5`);
                console.log(`   Текст: ${reviews[0].text.substring(0, 100)}...`);
                
                // Статистика
                const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                console.log(`📊 Статистика:`);
                console.log(`   Средний рейтинг: ${avgRating.toFixed(1)}/5`);
                console.log(`   Количество отзывов: ${reviews.length}`);
            } else {
                console.log('⚠️  Отзывы не найдены');
            }
        } catch (error) {
            console.log(`❌ Ошибка: ${error.message}`);
            console.log(`🔍 Детали ошибки:`, error);
        }
        
        console.log('─'.repeat(50));
    }
    
    console.log('🏁 Тестирование завершено');
}

// Функция для тестирования с реальными URL
async function testWithRealUrls() {
    const reviewsService = new ReviewsService();
    
    console.log('🧪 Тестирование с реальными URL...\n');
    
    // Замените на реальные URL для тестирования
    const realUrls = [
        // Добавьте реальные URL товаров здесь
        // 'https://www.wildberries.ru/catalog/REAL_ID/detail.aspx',
        // 'https://www.ozon.ru/product/REAL_ID/'
    ];
    
    if (realUrls.length === 0) {
        console.log('⚠️  Добавьте реальные URL в массив realUrls для тестирования');
        return;
    }
    
    for (const url of realUrls) {
        console.log(`📋 Тестируем реальный URL: ${url}`);
        
        try {
            const reviews = await reviewsService.getReviews(url);
            console.log(`✅ Получено отзывов: ${reviews.length}`);
            
            if (reviews.length > 0) {
                const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                console.log(`📊 Статистика: ${reviews.length} отзывов, средний рейтинг ${avgRating.toFixed(1)}/5`);
            }
        } catch (error) {
            console.log(`❌ Ошибка: ${error.message}`);
        }
        
        console.log('─'.repeat(50));
    }
    
    // Браузер автоматически возвращается в пул через browser-manager
}

// Запускаем тесты
async function runTests() {
    await testReviewsParser();
    console.log('\n');
    await testWithRealUrls();
}

runTests().catch(console.error);
