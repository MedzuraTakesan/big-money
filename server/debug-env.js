// Загружаем переменные окружения из .env файла
require('dotenv').config();

console.log('=== Отладка переменных окружения ===');
console.log('process.env.PORT:', process.env.PORT);
console.log('process.env.HOST:', process.env.HOST);
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

// Проверяем константы
const { SERVER_CONFIG } = require('./constants');
console.log('SERVER_CONFIG.PORT:', SERVER_CONFIG.PORT);
console.log('SERVER_CONFIG.HOST:', SERVER_CONFIG.HOST);

// Проверяем типы
console.log('Тип process.env.PORT:', typeof process.env.PORT);
console.log('Тип SERVER_CONFIG.PORT:', typeof SERVER_CONFIG.PORT);
