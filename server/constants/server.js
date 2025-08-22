// Server configuration constants
const SERVER_CONFIG = {
    PORT: parseInt(process.env.PORT) || 3005,
    HOST: process.env.HOST || 'localhost'
};

// API endpoints
const API_ENDPOINTS = {
    GET_PRODUCTS: '/get-products',
    GET_REVIEWS: '/get-reviews'
};

module.exports = {
    SERVER_CONFIG,
    API_ENDPOINTS
};
