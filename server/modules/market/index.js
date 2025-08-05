const ozon = require('./ozon/index.js');
const wildberries = require('./wildberries/index.js');

const getProductsFromName = async (productName) => {
    const promises = [
        ozon.search(productName),
        wildberries.search(productName)
    ];

    const results = await Promise.allSettled(promises);

    // Фильтруем только успешные промисы и возвращаем их значения
    return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .flat()
        .sort((a, b) => a.sale - b.sale)
};

module.exports = {
    getProductsFromName
};