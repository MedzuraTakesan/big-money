const puppeteer = require('puppeteer-extra');
const { Parser } = require('../helpers/parser/index.js');
const { ozon } = require('../helpers/parser/constants.js');

const parser = new Parser({
    domain: ozon.domain,
    waitUntil: ozon.waitUntil
});

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function searchText(productName) {
    const url = `https://www.ozon.ru/search/?text=${encodeURIComponent(productName)}`
    const selector = {
        block: '.ry9_31 .iu2_24 .oi4_24',
        selectors: {
            sale: '.c35_3_1-b1',
            price: '.c35_3_1-b',
            name: '.bq02_4_0-a4 > .tsBody500Medium'
        },
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