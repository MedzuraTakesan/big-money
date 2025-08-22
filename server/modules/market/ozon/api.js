const { Parser } = require('../helpers/parser/index.js');
const { ozon } = require('../helpers/parser/constants.js');
const { optimizedSearch } = require('../helpers/parser/optimizations.js');

const parser = new Parser({
    domain: ozon.domain,
    waitUntil: ozon.waitUntil,
    cookie: ozon.cookie
});

async function searchText(productName) {
    const url = `https://www.ozon.ru/search/?text=${encodeURIComponent(productName)}`;
    
    return await optimizedSearch(parser, url, 'ozon', productName);
}

module.exports = {
    searchText
};