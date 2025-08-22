const { Parser } = require('../helpers/parser/index.js');
const { wildberries } = require('../helpers/parser/constants.js');
const { optimizedSearch } = require('../helpers/parser/optimizations.js');

const parser = new Parser({
    domain: wildberries.domain,
    cookie: wildberries.cookie,
    waitUntil: wildberries.waitUntil
});

async function searchText(productName) {
    const url = `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(productName)}`;
    
    return await optimizedSearch(parser, url, 'wildberries', productName);
}

module.exports = {
    searchText
};