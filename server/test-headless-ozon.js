const { Parser } = require('./modules/market/helpers/parser/index.js');
const { optimizedSearch } = require('./modules/market/helpers/parser/optimizations.js');

async function testHeadlessOzon() {
    console.log('🧪 Тестирование парсинга Ozon в headless режиме с увеличенным разрешением...\n');

    // Настройки для тестирования
    const testProduct = 'ноутбук';
    const testUrl = 'https://www.ozon.ru/search/?text=ноутбук';

    // Создаем парсер
    const ozonParser = new Parser({
        domain: '.ozon.ru',
        cookie: 'test-cookie=value'
    });

    console.log('🔄 Тест 1: Парсинг Ozon с подгрузкой контента (1920x1080)');
    const startTime = Date.now();
    
    try {
        const results = await optimizedSearch(ozonParser, testUrl, 'ozon', testProduct);
        
        const endTime = Date.now();
        console.log(`✅ Парсинг завершен за ${endTime - startTime}ms`);
        console.log(`📦 Найдено товаров: ${results.length}`);
        
        // Показываем первые 3 товара
        if (results.length > 0) {
            console.log('\n📋 Первые товары:');
            results.slice(0, 3).forEach((item, index) => {
                console.log(`${index + 1}. ${item.name ? item.name.substring(0, 50) + '...' : 'No name'}`);
                console.log(`   Цена: ${item.price || 'No price'}`);
                console.log(`   Скидка: ${item.sale || 'No sale'}`);
                console.log(`   Отзывы: ${item.reviews || 'No reviews'}`);
                console.log('');
            });
        }
        
        // Статистика
        console.log('📊 Статистика:');
        console.log(`- Всего товаров: ${results.length}`);
        console.log(`- Время выполнения: ${endTime - startTime}ms`);
        console.log(`- Среднее время на товар: ${results.length > 0 ? Math.round((endTime - startTime) / results.length) : 0}ms`);
        
    } catch (error) {
        console.error('❌ Ошибка в парсинге:', error.message);
        console.error('🔍 Детали ошибки:', error.stack);
    } finally {
        // Закрываем браузеры
        try {
            await Parser.closeAllBrowsers();
            console.log('✅ Браузеры закрыты');
        } catch (closeError) {
            console.error('❌ Ошибка при закрытии браузеров:', closeError.message);
        }
    }
    
    console.log('✅ Тестирование завершено');
}

// Запускаем тест
testHeadlessOzon().catch(console.error);
