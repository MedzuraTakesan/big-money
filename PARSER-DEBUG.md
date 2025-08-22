# Отладка парсера отзывов

## Проблемы и решения

### 1. Ошибка: TypeError: page.waitForTimeout is not a function

**Причина:** В новых версиях Puppeteer метод `waitForTimeout` был удален.

**Решение:** Заменен на `setTimeout` с Promise:
```javascript
// Было:
await page.waitForTimeout(3000);

// Стало:
await new Promise(resolve => setTimeout(resolve, 3000));
```

### 2. Ошибка: TimeoutError при ожидании селектора `[data-review-uuid]`

**Причина:** Отзывы на Ozon загружаются динамически и могут иметь разные селекторы.

**Решение:** Улучшенный парсер теперь:
1. Ждет загрузки основного контента
2. Скроллит страницу несколько раз
3. Пробует разные селекторы для поиска отзывов
4. Использует множественные попытки для извлечения данных

## Улучшения парсера

### Архитектура
- ✅ Интегрирован с существующим `browser-manager`
- ✅ Использует пул браузеров для лучшей производительности
- ✅ Stealth режим для обхода блокировок
- ✅ Автоматическое управление жизненным циклом браузеров

### Wildberries
- ✅ Убрали жесткую зависимость от селектора `.comments__item.feedback`
- ✅ Добавили альтернативные селекторы
- ✅ Улучшили извлечение автора, текста и рейтинга
- ✅ Добавили подробное логирование

### Ozon
- ✅ Убрали ожидание конкретного селектора `[data-review-uuid]`
- ✅ Реализовали постепенный скролл с самого начала страницы
- ✅ Добавили проверку наличия отзывов во время скролла
- ✅ Реализовали fallback селекторы
- ✅ Улучшили обработку динамического контента

## Селекторы для отладки

### Wildberries
```javascript
// Основные селекторы
'.comments__item.feedback'
'.feedback'
'[class*="feedback"]'
'li[class*="comments"]'

// Автор
'.feedback__header'
'[class*="header"]'
'[class*="author"]'

// Текст
'.feedback__text .feedback__text--item'
'.feedback__text'
'[class*="text"]'

// Рейтинг
'.feedback__rating'
'[class*="rating"]'
'[class*="star"]'
```

### Ozon
```javascript
// Основные селекторы
'[data-review-uuid]'
'.vo7_30'
'[class*="review"]'
'div[class*="vo7"]'

// Автор
'.s2o_30'
'[class*="author"]'
'[class*="name"]'

// Текст
'.v1o_30'
'[class*="text"]'
'[class*="content"]'

// Рейтинг
'.v0o_30 svg[width="20"][height="20"]'
'[class*="rating"] svg'
'[class*="star"]'
```

## Тестирование

### Запуск тестов
```bash
cd server
node test-reviews.js
```

### Добавление реальных URL
Отредактируйте файл `test-reviews.js` и добавьте реальные URL в массив `realUrls`:

```javascript
const realUrls = [
    'https://www.wildberries.ru/catalog/REAL_ID/detail.aspx',
    'https://www.ozon.ru/product/REAL_ID/'
];
```

### Проверка логов
В консоли сервера должны появиться логи:
```
📥 Получен запрос на /get-reviews
🔗 URL товара: ...
✅ URL валиден, начинаем парсинг...
Переходим на страницу отзывов Wildberries: ...
Найдено элементов отзывов: X
Успешно получено отзывов: X
```

## Возможные проблемы

### 1. Отзывы не загружаются
**Решение:** Настройте параметры скролла в коде:
```javascript
// В parseOzonReviews
const scrollStep = 800; // Увеличить шаг скролла
const maxScrolls = 30; // Увеличить количество скроллов
```

### 2. Неправильные селекторы
**Решение:** Проверьте актуальные селекторы на сайте и добавьте их в массив селекторов.

### 3. Блокировка от парсера
**Решение:** Добавьте задержки и User-Agent:
```javascript
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
await new Promise(resolve => setTimeout(resolve, 5000)); // Увеличить задержку
```

### 4. Динамическая загрузка
**Решение:** Добавьте ожидание загрузки:
```javascript
await page.waitForFunction(() => {
    return document.querySelectorAll('[class*="review"]').length > 0;
}, { timeout: 30000 });
```

## Мониторинг

### Логи для отслеживания
- Количество найденных элементов отзывов
- Успешность извлечения данных
- Время выполнения парсинга
- Ошибки и исключения

### Метрики производительности
- Время загрузки страницы
- Количество попыток скролла
- Процент успешных извлечений
- Средний рейтинг отзывов
