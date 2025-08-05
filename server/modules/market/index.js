const ozon = require('./ozon/index.js');
const wildberries = require('./wildberries/index.js');

const getProductsFromName = async (productName) => {
    const promises = [
        ozon.search(productName),
        wildberries.search(productName)
    ];

    const results = await Promise.allSettled(promises);

    const allProducts = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .flat();

    // Разделяем на товары Ozon и Wildberries
    const ozonProducts = allProducts.filter(p => p.marketplace === 'ozon');
    const wbProducts = allProducts.filter(p => p.marketplace === 'wildberries');

    // Чередуем товары
    const mixed = [];
    let i = 0, j = 0;

    while (i < ozonProducts.length || j < wbProducts.length) {
        if (i < ozonProducts.length) {
            mixed.push(ozonProducts[i]);
            i++;
        }
        if (j < wbProducts.length) {
            mixed.push(wbProducts[j]);
            j++;
        }
    }

    return mixed;
};

module.exports = {
    getProductsFromName
};