const express = require('express');
const { API_ENDPOINTS } = require('../constants');
const ServiceFactory = require('../factories/ServiceFactory');

class ProductRoutes {
    /**
     * Создает и настраивает роутер для продуктов
     * @returns {express.Router} настроенный роутер
     */
    static createRouter() {
        const router = express.Router();
        const productController = ServiceFactory.createProductController();

        // GET /get-products - получение продуктов
        router.get(API_ENDPOINTS.GET_PRODUCTS, (req, res) => {
            productController.getProducts(req, res);
        });

        return router;
    }
}

module.exports = ProductRoutes;
