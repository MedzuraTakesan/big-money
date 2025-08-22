// Загружаем переменные окружения из .env файла
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Отладочная информация
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('HOST:', process.env.HOST);
console.log('Current directory:', __dirname);
console.log('Env file path:', path.join(__dirname, '.env'));

const App = require('./app/App');

// Создаем и запускаем приложение
const app = new App();
app.start();