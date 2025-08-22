const express = require('express');
const { SERVER_CONFIG, LOG_MESSAGES } = require('../constants');
const ProductRoutes = require('../routes/ProductRoutes');

class App {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    /**
     * Настраивает middleware для приложения
     */
    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });
    }

    /**
     * Настраивает маршруты приложения
     */
    setupRoutes() {
        const productRoutes = ProductRoutes.createRouter();
        this.app.use('/', productRoutes);
    }

    /**
     * Запускает сервер
     */
    start() {
        this.app.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
            console.log(`${LOG_MESSAGES.SERVER_STARTED} ${SERVER_CONFIG.PORT}`);
        });
    }

    /**
     * Получает экземпляр Express приложения
     * @returns {express.Application} экземпляр приложения
     */
    getApp() {
        return this.app;
    }
}

module.exports = App;
