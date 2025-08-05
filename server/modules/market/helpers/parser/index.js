const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


class Parser {
    constructor(params) {
        this.domain = params.domain;
        this.cookie = this.parseCookies(params.cookie);
        this.waitUntil = params.waitUntil;
    }

    parseCookies(cookieStr) {
        if (!cookieStr) {
            return []
        }

        return cookieStr.split(';').map(cookie => {
            const [name, ...rest] = cookie.trim().split('=');
            return {
                name,
                value: rest.join('='),
                domain: this.domain,
                path: '/',
                httpOnly: false,
                secure: true
            };
        });
    }

    // Метод для обработки всех блоков на странице
    async processAllBlocks({ page, block, selectors = {}, links = {}, imgs = {} }) {
        console.log({
            selectors,
            links,
            imgs
        })
        return page.$$eval(
            block,
            (blocks, { selectors, links, imgs}) => {
                return blocks.map(element => {
                    const data = {};
                    for (const [key, selector] of Object.entries(selectors)) {
                        try {
                            const el = element.querySelector(selector);
                            data[key] = el ? el.textContent.trim() : null;
                        } catch (error) {
                            console.error(`Error processing selector ${key}:`, error);
                            data[key] = null;
                        }
                    }

                    for (const [key, link] of Object.entries(links)) {
                        try {
                            const el = element.querySelector(link);
                            data[key] = el ? el.href : null;
                        } catch (error) {
                            console.error(`Error processing selector ${key}:`, error);
                            data[key] = null;
                        }
                    }

                    for (const [key, img] of Object.entries(imgs)) {
                        try {
                            const el = element.querySelector(img);
                            data[key] = el ? el.src : null;
                        } catch (error) {
                            console.error(`Error processing selector ${key}:`, error);
                            data[key] = null;
                        }
                    }
                    return data;
                });
            },
            {
                selectors,
                links,
                imgs
            } // Передаем объект селекторов как аргумент
        );
    }


    async getTextFromSelector({ url, selector }) {
        const browser = await puppeteer.launch({
            headless: true, // 👈 обязательно false
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        );

        if (this.cookie.length) {
            await page.setCookie(...this.cookie);
        }

        await page.goto(url, {
            waitUntil: this.waitUntil,
            timeout: 0
        });

        await page.waitForSelector(selector.block)

        // Scrolling to the bottom of the page
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Обрабатываем все блоки с помощью вынесенной логики
        const result = await this.processAllBlocks({
            page,
            ...selector
        });
        await browser.close();

        return result;
    }
}


module.exports = {
    Parser
};