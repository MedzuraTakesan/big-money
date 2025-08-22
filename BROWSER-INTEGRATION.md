# Интеграция парсера отзывов с browser-manager

## Обзор

Парсер отзывов теперь использует существующий `browser-manager` вместо создания собственного браузера. Это обеспечивает лучшую производительность, управление ресурсами и стабильность.

## Преимущества интеграции

### 🚀 Производительность
- **Пул браузеров**: До 3 браузеров для параллельной обработки
- **Переиспользование**: Браузеры не создаются заново для каждого запроса
- **Оптимизация**: Настроенные аргументы для каждого маркетплейса

### 🛡️ Стабильность
- **Stealth режим**: Использование `puppeteer-extra` с `stealth-plugin`
- **Обработка ошибок**: Централизованное управление жизненным циклом
- **Таймауты**: Настроенные таймауты для предотвращения зависаний

### 🔧 Управление ресурсами
- **Автоматическое возвращение**: Браузеры автоматически возвращаются в пул
- **Очистка**: Автоматическое закрытие неиспользуемых браузеров
- **Мониторинг**: Статистика использования пула

## Архитектура

### Browser Manager
```javascript
// server/modules/market/helpers/parser/browser-manager.js
const { browserManager } = require('../modules/market/helpers/parser/browser-manager');

// Получение браузера из пула
const browser = await browserManager.getBrowser();

// Возврат браузера в пул
browserManager.returnBrowser(browser);
```

### Reviews Service
```javascript
// server/services/ReviewsService.js
class ReviewsService {
    async parseWildberriesReviews(reviewsUrl) {
        const browser = await browserManager.getBrowser();
        const page = await browser.newPage();
        
        try {
            // Парсинг отзывов
            const reviews = await page.evaluate(() => {
                // Логика парсинга
            });
            return reviews;
        } finally {
            await page.close();
            browserManager.returnBrowser(browser); // Возврат в пул
        }
    }
}
```

## Настройки браузера

### Stealth режим
```javascript
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
```

### Оптимизированные аргументы
```javascript
args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
    '--window-size=1920,1080',
    '--start-maximized',
    // ... и многие другие для производительности
]
```

## Мониторинг

### Статистика пула
```javascript
const stats = browserManager.getStats();
console.log(stats);
// {
//   poolSize: 2,
//   maxBrowsers: 3,
//   isShuttingDown: false,
//   initializationPromises: 0
// }
```

### Логи
```
📥 Получен запрос на /get-reviews
🔗 URL товара: ...
✅ URL валиден, начинаем парсинг...
Переходим на страницу отзывов Wildberries: ...
Найдено элементов отзывов: X
Успешно получено отзывов: X
```

## Преимущества перед старым подходом

### ❌ Старый подход
- Создание нового браузера для каждого запроса
- Отсутствие пула браузеров
- Простые настройки без stealth
- Ручное управление жизненным циклом

### ✅ Новый подход
- Переиспользование браузеров из пула
- Параллельная обработка запросов
- Stealth режим для обхода блокировок
- Автоматическое управление ресурсами

## Производительность

### Метрики
- **Время инициализации браузера**: ~2-3 секунды (только при создании)
- **Время получения из пула**: ~50ms
- **Максимум параллельных запросов**: 3
- **Автоматическая очистка**: При превышении лимита

### Оптимизации
- **Кэширование**: Браузеры остаются в памяти
- **Переиспользование**: Страницы создаются быстро
- **Stealth**: Меньше блокировок от сайтов
- **Параллелизм**: Несколько запросов одновременно

## Отладка

### Проблемы с пулом
```javascript
// Проверка состояния пула
console.log('Pool size:', browserManager.getPoolSize());
console.log('Stats:', browserManager.getStats());

// Принудительная очистка (только для отладки)
await browserManager.closeAllBrowsers();
```

### Логи браузера
```javascript
// Включение логов браузера
const page = await browser.newPage();
page.on('console', msg => console.log('Browser:', msg.text()));
```

## Заключение

Интеграция с `browser-manager` значительно улучшила производительность и стабильность парсера отзывов. Теперь система использует проверенную архитектуру с пулом браузеров, что обеспечивает:

- ✅ Лучшую производительность
- ✅ Стабильность работы
- ✅ Эффективное использование ресурсов
- ✅ Обход блокировок
- ✅ Централизованное управление
