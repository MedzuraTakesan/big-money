# Быстрая настройка функционала отзывов

## Запуск сервера

```bash
cd server
npm install
npm start
```

Сервер запустится на `http://localhost:3005`

## Запуск фронтенда

```bash
cd front
npm install
npm run dev
```

Фронтенд запустится на `http://localhost:3000`

## Тестирование парсера

```bash
cd server
node test-reviews.js
```

## Использование

1. Откройте `http://localhost:3000`
2. Найдите товар в поиске
3. Нажмите кнопку "Получить отзывы" под карточкой товара
4. Дождитесь загрузки отзывов в модальном окне

## Поддерживаемые URL

### Wildberries
- `https://www.wildberries.ru/catalog/{id}/detail.aspx`
- `https://www.wildberries.ru/catalog/{id}/`

### Ozon
- `https://www.ozon.ru/product/{id}/`

## API эндпоинт

```
GET /get-reviews?url={product_url}
```

Пример:
```
GET /get-reviews?url=https://www.wildberries.ru/catalog/12345678/detail.aspx
```

## Структура ответа

```json
{
  "success": true,
  "data": [
    {
      "author": "Имя автора",
      "text": "Текст отзыва",
      "rating": 5
    }
  ]
}
```
