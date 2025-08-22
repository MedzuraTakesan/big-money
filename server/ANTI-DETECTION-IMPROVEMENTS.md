# Улучшения антидетекции для парсинга отзывов

## Проблема
Ozon блокировал открытие страниц отзывов в Puppeteer, в то время как парсинг товаров работал нормально. Это было связано с тем, что при запросе отзывов не устанавливались куки.

## Решение

### 1. Установка куки для Ozon
В `ReviewsService.js` добавлена установка куки для Ozon, аналогично тому, как это делается в парсере товаров:

```javascript
// Устанавливаем куки для Ozon (как в парсинге товаров)
const { ozon } = require('../modules/market/helpers/parser/constants.js');
const parser = new (require('../modules/market/helpers/parser/index.js').Parser)({
    domain: ozon.domain,
    waitUntil: ozon.waitUntil,
    cookie: ozon.cookie
});

if (parser.cookie.length) {
    await page.setCookie(...parser.cookie);
    console.log('🍪 Установлены куки для Ozon');
}
```

### 2. Установка куки для Wildberries
Аналогично добавлена поддержка куки для Wildberries:

```javascript
// Устанавливаем куки для Wildberries (если есть)
const { wildberries } = require('../modules/market/helpers/parser/constants.js');
const parser = new (require('../modules/market/helpers/parser/index.js').Parser)({
    domain: wildberries.domain,
    waitUntil: wildberries.waitUntil,
    cookie: wildberries.cookie
});

if (parser.cookie.length) {
    await page.setCookie(...parser.cookie);
    console.log('🍪 Установлены куки для Wildberries');
}
```

### 3. Улучшенная эмуляция пользователя
Добавлены дополнительные методы эмуляции реального пользователя:

- Эмуляция событий мыши
- Эмуляция скролла
- Эмуляция DOMContentLoaded
- Дополнительные задержки

### 4. Детекция блокировки
Добавлена проверка на признаки блокировки:

```javascript
// Проверяем на признаки блокировки
if (bodyText.includes('Доступ ограничен') || 
    bodyText.includes('Access denied') || 
    bodyText.includes('blocked') ||
    bodyText.includes('captcha') ||
    bodyText.length < 1000) {
    console.warn('⚠️ Возможная блокировка Ozon, пробуем обойти...');
}
```

### 5. Расширенные селекторы
Добавлены дополнительные селекторы для поиска отзывов:

- `[data-review-uuid]`
- `.vo7_30`
- `[class*="review"]`
- `div[class*="vo7"]`
- `[class*="feedback"]`

## Тестирование

Создан тестовый файл `test-reviews-with-cookies.js` для проверки работы отзывов с установленными куками.

## Результат

После внесения изменений:
- Ozon больше не блокирует просмотр отзывов
- Улучшена стабильность парсинга
- Добавлена детекция блокировки
- Расширены возможности поиска отзывов

## Рекомендации

1. Регулярно обновлять куки в `constants.js`
2. Мониторить изменения в структуре страниц
3. Использовать разные User-Agent для разных запросов
4. Добавить ротацию прокси при необходимости
