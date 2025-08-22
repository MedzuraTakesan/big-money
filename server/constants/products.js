// Sort options for products
const SORT_OPTIONS = {
    REVIEWS: 'reviews',
    PRICE: 'price',
    NAME: 'name'
};

// Product field mappings
const PRODUCT_FIELDS = {
    REVIEWS_COUNT: 'reviewsCount',
    SALE: 'sale',
    PRICE: 'price',
    NAME: 'name',
    MARKETPLACE: 'marketplace'
};

// Default values for products
const DEFAULTS = {
    SORT_BY: SORT_OPTIONS.REVIEWS,
    EMPTY_ARRAY: []
};

module.exports = {
    SORT_OPTIONS,
    PRODUCT_FIELDS,
    DEFAULTS
};
