// Import constants from separate files
const { SERVER_CONFIG, API_ENDPOINTS } = require('./server');
const { MARKETPLACES, URL_TEMPLATES } = require('./marketplaces');
const { SORT_OPTIONS, PRODUCT_FIELDS, DEFAULTS } = require('./products');
const { ERROR_MESSAGES, LOG_MESSAGES } = require('./messages');

// Export all constants
module.exports = {
    SERVER_CONFIG,
    API_ENDPOINTS,
    MARKETPLACES,
    SORT_OPTIONS,
    DEFAULTS,
    URL_TEMPLATES,
    ERROR_MESSAGES,
    LOG_MESSAGES,
    PRODUCT_FIELDS
};
