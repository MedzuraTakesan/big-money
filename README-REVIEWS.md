# Парсер отзывов для Wildberries и Ozon

## Описание

**ФУНКЦИОНАЛ УДАЛЕН**

Данный функционал был удален из проекта. Ранее здесь был парсер отзывов для Wildberries и Ozon.

## Архитектура

### Backend (Node.js + Express)

#### Новые файлы:
- `server/services/ReviewService.js` - сервис для парсинга отзывов
- `server/controllers/ReviewController.js` - контроллер для обработки запросов
- `server/routes/ReviewRoutes.js` - роуты для API отзывов

#### Обновленные файлы:
- `server/constants/server.js` - добавлен новый эндпоинт `/get-reviews`
- `server/factories/ServiceFactory.js` - добавлены фабрики для ReviewService и ReviewController
- `server/app/App.js` - подключены новые роуты

### Frontend (Nuxt 3 + Vue 3)

#### Новые файлы:
- `front/app/stores/reviews/index.ts` - Pinia стор для управления отзывами
- `front/app/components/ReviewsModal/index.vue` - модальное окно для отображения отзывов

#### Обновленные файлы:
- `front/app/components/products/ProductCard/index.vue` - добавлена кнопка "Получить отзывы"
- `front/app/components/products/ProductCard/styles.scss` - стили для новой кнопки
- `front/app/app.vue` - подключен компонент модального окна

## API Endpoints

### GET /api/get-reviews

Получает отзывы для товара по ссылке.

**Параметры:**
- `productUrl` (string, обязательный) - ссылка на товар
- `limit` (number, опциональный) - максимальное количество отзывов (по умолчанию 32)

**Пример запроса:**
```
GET /api/get-reviews?productUrl=https://www.wildberries.ru/catalog/12345678/detail.aspx&limit=10
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "text": "Отличный товар! Очень доволен покупкой.",
      "rating": 5,
      "marketplace": "wildberries"
    }
  ]
}
```

## Алгоритм парсинга

### Wildberries
1. Извлекаем ID товара из URL (поддерживаемые форматы: `/catalog/12345678/detail.aspx`, `/catalog/12345678/`, `/catalog/12345678`)
2. Формируем URL страницы отзывов: `https://www.wildberries.ru/feedbacks/{productId}`
3. Переходим на страницу с настроенным User-Agent
4. Ждем загрузки основного контента (3 секунды)
5. Пробуем разные селекторы: `.comments__item.feedback`, `.feedback`, `[class*="feedback"]`
6. Извлекаем текст отзыва, пробуя селекторы: `.feedback__text--item`, `.feedback__text`, `[class*="text"]`
7. Определяем рейтинг по классу `.feedback__rating` (star1-star5)

### Ozon
1. Переходим на страницу товара с настроенным User-Agent
2. Ждем загрузки основного контента (3 секунды)
3. Скроллим вниз несколько раз для загрузки отзывов
4. Пробуем разные селекторы: `[data-review-uuid]`, `.vo7_30`, `[class*="review"]`
5. Извлекаем текст отзыва, пробуя селекторы: `.v1o_30`, `[class*="text"]`, `p`, `span`
6. Подсчитываем рейтинг, ища заполненные звезды в: `.v0o_30`, `[class*="rating"]`, `[class*="star"]`

## Установка и запуск

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd front
npm install
npm run dev
```

### Тестирование парсера
```bash
cd server
node test-reviews.js
```

## Зависимости

### Backend
- `puppeteer` - для парсинга динамического контента
- `express` - веб-сервер
- `dotenv` - переменные окружения

### Frontend
- `@pinia/nuxt` - управление состоянием
- `nuxt` - фреймворк

## Особенности реализации

1. **Безопасность**: Парсинг происходит только с поддерживаемых маркетплейсов
2. **Производительность**: Используется headless браузер для обработки JavaScript
3. **UX**: Модальное окно с загрузкой и обработкой ошибок
4. **Адаптивность**: Модальное окно адаптировано под мобильные устройства
5. **Ограничения**: Максимум 32 отзыва для предотвращения перегрузки
6. **Надежность**: Множественные селекторы для адаптации к изменениям в верстке
7. **Логирование**: Подробные логи для отладки и мониторинга
8. **User-Agent**: Настройка браузера для избежания блокировки

## Обработка ошибок

- Неверная ссылка на товар
- Неподдерживаемая площадка
- Ошибки сети
- Отсутствие отзывов
- Таймауты загрузки

## Планы развития

1. Добавление поддержки других маркетплейсов
2. Кэширование отзывов
3. Фильтрация и сортировка отзывов
4. Экспорт отзывов в различные форматы
5. Анализ тональности отзывов
