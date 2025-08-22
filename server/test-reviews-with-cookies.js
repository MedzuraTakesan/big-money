const ReviewsService = require('./services/ReviewsService');

async function testReviewsWithCookies() {
    console.log('🧪 Тестируем отзывы с куками...');
    
    const reviewsService = new ReviewsService();
    
    // Тестовые URL
    const testUrls = [
        'https://www.ozon.ru/product/smartfon-apple-iphone-15-pro-128gb-titanium-1234567890/',
        'https://www.wildberries.ru/catalog/12345678/detail.aspx'
    ];
    
    for (const url of testUrls) {
        try {
            console.log(`\n🔗 Тестируем URL: ${url}`);
            const reviews = await reviewsService.getReviews(url);
            console.log(`✅ Получено отзывов: ${reviews.length}`);
            
            if (reviews.length > 0) {
                console.log('📝 Первый отзыв:', {
                    author: reviews[0].author,
                    text: reviews[0].text.substring(0, 100) + '...',
                    rating: reviews[0].rating
                });
            }
        } catch (error) {
            console.error(`❌ Ошибка при тестировании ${url}:`, error.message);
        }
    }
    
    console.log('\n✅ Тестирование завершено');
}

// Запускаем тест
testReviewsWithCookies().catch(console.error);
