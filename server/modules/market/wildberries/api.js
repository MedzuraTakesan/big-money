const puppeteer = require('puppeteer-extra');
const { Parser } = require('../helpers/parser/index.js');
const { wildberries } = require('../helpers/parser/constants.js');

const parser = new Parser({
    domain: wildberries.domain,
    cookie: wildberries.cookie,
    waitUntil: wildberries.waitUntil
});

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function searchText(productName) {
    const url = `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(productName)}`
    const selector = {
        block: '.product-card',
        selectors: {
            sale: 'span>ins',
            price: 'span>del',
            name: '.product-card__name'
        },
        links: {
            cardLink: '.product-card__link'
        },
        imgs: {
            cardImg: '.product-card__img-wrap > img'
        }
    }
    const startTime =  Date.now();

    const products = await parser.getTextFromSelector({
        url,
        selector
    });

    const endTime =  Date.now();

    console.log(`Время выполнения - ${endTime - startTime}ms`);


    return products;
}

module.exports = {
    searchText
};