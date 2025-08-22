# Отладка проблемы с запросами отзывов

## Проблема
Запросы на получение отзывов не доходят до сервера.

## Решения

### 1. Проверка прокси в Nuxt

В `front/nuxt.config.ts` настроен прокси только для путей `/api/*`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3005',
    changeOrigin: true,
    rewrite: (path) => path.replace('/api', ''),
  }
}
```

**Исправление**: В компоненте `ReviewsModal` изменен URL с `/get-reviews` на `/api/get-reviews`.

### 2. Добавлен CORS middleware

В `server/app/App.js` добавлен CORS middleware для обработки кросс-доменных запросов.

### 3. Добавлено логирование

В `server/controllers/ReviewsController.js` добавлено подробное логирование для отладки.

## Пошаговая отладка

### Шаг 1: Проверка работы сервера
```bash
cd server
node test-server.js
```

Откройте в браузере:
- `http://localhost:3005/health` - должен вернуть `{"status":"OK"}`
- `http://localhost:3005/get-reviews?url=test` - должен вернуть тестовые отзывы

### Шаг 2: Проверка основного сервера
```bash
cd server
npm start
```

В консоли должны появиться логи о запуске сервера.

### Шаг 3: Проверка фронтенда
```bash
cd front
npm run dev
```

Откройте `http://localhost:3000` и попробуйте получить отзывы.

### Шаг 4: Проверка в DevTools

1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Нажмите кнопку "Получить отзывы"
4. Проверьте, отправляется ли запрос на `/api/get-reviews`

### Шаг 5: Проверка логов сервера

В консоли сервера должны появиться логи:
```
📥 Получен запрос на /get-reviews
Query params: { url: '...' }
🔗 URL товара: ...
✅ URL валиден, начинаем парсинг...
```

## Возможные проблемы

### 1. Сервер не запущен
**Решение**: Запустите сервер командой `npm start` в папке `server`

### 2. Неправильный порт
**Проверьте**: Сервер должен работать на порту 3005

### 3. CORS ошибки
**Решение**: CORS middleware уже добавлен в сервер

### 4. Прокси не работает
**Проверьте**: 
- URL в компоненте должен начинаться с `/api/`
- Конфигурация прокси в `nuxt.config.ts`

### 5. Puppeteer не установлен
**Решение**: 
```bash
cd server
npm install puppeteer
```

## Тестовые команды

### Тест сервера
```bash
cd server
node test-server.js
```

### Тест парсера
```bash
cd server
node test-reviews.js
```

### Проверка эндпоинта
```bash
curl "http://localhost:3005/get-reviews?url=https://www.wildberries.ru/catalog/12345678/detail.aspx"
```

## Логи для отладки

### В браузере (Console)
- Ошибки JavaScript
- Ошибки сети
- Ответы от сервера

### В сервере (Terminal)
- Логи запуска
- Логи запросов
- Ошибки парсинга
- Ошибки Puppeteer
