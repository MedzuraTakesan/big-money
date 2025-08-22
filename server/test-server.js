const express = require('express');
const app = express();

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Test endpoint
app.get('/get-reviews', (req, res) => {
    console.log('✅ Получен запрос на /get-reviews');
    console.log('Query params:', req.query);
    
    res.json({
        success: true,
        data: [
            {
                author: 'Тестовый пользователь',
                text: 'Это тестовый отзыв для проверки работы API',
                rating: 5
            }
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Сервер работает' });
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`🚀 Тестовый сервер запущен на порту ${PORT}`);
    console.log(`📋 Доступные эндпоинты:`);
    console.log(`   GET http://localhost:${PORT}/health`);
    console.log(`   GET http://localhost:${PORT}/get-reviews?url=test`);
});
