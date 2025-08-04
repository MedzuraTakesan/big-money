const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const cookiesString = '__Secure-ab-group=18; __Secure-ext_xcid=931efe3ff15d3e0a2c47c797f4ae6add; __Secure-user-id=35735018; ob_theme=SYSTEM; ob-unique-device-id=93787220-6074-4a9d-83ce-45455ad038b2; xcid=90a7299f77d3f914c00cd7eeda16cbd9; is_adult_confirmed=true; feedbackIds=[567]; __Secure-ETC=8bd5e33e88cfffc6be599e7c3cc7e0ab; abt_data=7.-UToiSJm4yloMMOzbghSQin4eh8eBWYmIMIHVJiudyyI1w-uAGp3hcKqkqRSLdCYA4m65iCfzoCGTAaD6kqF_qeRSJN2z95hxOf0-uTV-3bj5ugMKCQk7HH4TT_Mf5L1BwhMPoPvEIAh4cGOSa_NZHlrSgE3ZWQK5Q8QpJZ_ONynj8BUpbfahbQosZuzNz3R9Y9sxFcVhqLTLyAsBMu6ZQv_URPymwhrNJ827lJhcdoRkIQxw_nY8clhwFBzqKMxT0k7JjmK2-6KS4pTVOViyE4ps5yo8vG_uV8m1d4IeofpehD55A-Yp1Kq2tX7d5mjunAVeyCYj48YsH2h-BwtaVMDpOw368rkzmnU5bTOFkLIHN3Z_AwmoUV1jbtUxSZFAUu0r6R30I5L-7oSshV4bvRP6As79KbZ8mYBQsK3-tYjtR0Htf-GY3kaiHQeEedW82aZDeaAqEtjGWh-LhTjQodoz6KJy8gSRb8jH0nnGRn6pyKCXxeJsyQMuo0K9InMBFQ6NdkuzTix4_RAq2SrJDeqzJlRE_1iWHtHLw; rfuid=LTE5NTAyNjU0NzAsMTI0LjA0MzQ3NTI3NTE2MDc0LDEwMjgyMzcyMjMsLTEsMTE4OTYwMjc2NixXM3NpYm1GdFpTSTZJbEJFUmlCV2FXVjNaWElpTENKa1pYTmpjbWx3ZEdsdmJpSTZJbEJ2Y25SaFlteGxJRVJ2WTNWdFpXNTBJRVp2Y20xaGRDSXNJbTFwYldWVWVYQmxjeUk2VzNzaWRIbHdaU0k2SW1Gd2NHeHBZMkYwYVc5dUwzQmtaaUlzSW5OMVptWnBlR1Z6SWpvaWNHUm1JbjBzZXlKMGVYQmxJam9pZEdWNGRDOXdaR1lpTENKemRXWm1hWGhsY3lJNkluQmtaaUo5WFgwc2V5SnVZVzFsSWpvaVEyaHliMjFsSUZCRVJpQldhV1YzWlhJaUxDSmtaWE5qY21sd2RHbHZiaUk2SWxCdmNuUmhZbXhsSUVSdlkzVnRaVzUwSUVadmNtMWhkQ0lzSW0xcGJXVlVlWEJsY3lJNlczc2lkSGx3WlNJNkltRndjR3hwWTJGMGFXOXVMM0JrWmlJc0luTjFabVpwZUdWeklqb2ljR1JtSW4wc2V5SjBlWEJsSWpvaWRHVjRkQzl3WkdZaUxDSnpkV1ptYVhobGN5STZJbkJrWmlKOVhYMHNleUp1WVcxbElqb2lRMmh5YjIxcGRXMGdVRVJHSUZacFpYZGxjaUlzSW1SbGMyTnlhWEIwYVc5dUlqb2lVRzl5ZEdGaWJHVWdSRzlqZFcxbGJuUWdSbTl5YldGMElpd2liV2x0WlZSNWNHVnpJanBiZXlKMGVYQmxJam9pWVhCd2JHbGpZWFJwYjI0dmNHUm1JaXdpYzNWbVptbDRaWE1pT2lKd1pHWWlmU3g3SW5SNWNHVWlPaUowWlhoMEwzQmtaaUlzSW5OMVptWnBlR1Z6SWpvaWNHUm1JbjFkZlN4N0ltNWhiV1VpT2lKTmFXTnliM052Wm5RZ1JXUm5aU0JRUkVZZ1ZtbGxkMlZ5SWl3aVpHVnpZM0pwY0hScGIyNGlPaUpRYjNKMFlXSnNaU0JFYjJOMWJXVnVkQ0JHYjNKdFlYUWlMQ0p0YVcxbFZIbHdaWE1pT2x0N0luUjVjR1VpT2lKaGNIQnNhV05oZEdsdmJpOXdaR1lpTENKemRXWm1hWGhsY3lJNkluQmtaaUo5TEhzaWRIbHdaU0k2SW5SbGVIUXZjR1JtSWl3aWMzVm1abWw0WlhNaU9pSndaR1lpZlYxOUxIc2libUZ0WlNJNklsZGxZa3RwZENCaWRXbHNkQzFwYmlCUVJFWWlMQ0prWlhOamNtbHdkR2x2YmlJNklsQnZjblJoWW14bElFUnZZM1Z0Wlc1MElFWnZjbTFoZENJc0ltMXBiV1ZVZVhCbGN5STZXM3NpZEhsd1pTSTZJbUZ3Y0d4cFkyRjBhVzl1TDNCa1ppSXNJbk4xWm1acGVHVnpJam9pY0dSbUluMHNleUowZVhCbElqb2lkR1Y0ZEM5d1pHWWlMQ0p6ZFdabWFYaGxjeUk2SW5Ca1ppSjlYWDFkLFd5SnlkU0pkLDAsMSwwLDI0LDIzNzQxNTkzMCw4LDIyNzEyNjUyMCwwLDEsMCwtNDkxMjc1NTIzLFIyOXZaMnhsSUVsdVl5NGdUbVYwYzJOaGNHVWdSMlZqYTI4Z1YybHVNeklnTlM0d0lDaFhhVzVrYjNkeklFNVVJREV3TGpBN0lGZHBialkwT3lCNE5qUXBJRUZ3Y0d4bFYyVmlTMmwwTHpVek55NHpOaUFvUzBoVVRVd3NJR3hwYTJVZ1IyVmphMjhwSUVOb2NtOXRaUzh4TXpndU1DNHdMakFnVTJGbVlYSnBMelV6Tnk0ek5pQXlNREF6TURFd055Qk5iM3BwYkd4aCxleUpqYUhKdmJXVWlPbnNpWVhCd0lqcDdJbWx6U1c1emRHRnNiR1ZrSWpwbVlXeHpaU3dpU1c1emRHRnNiRk4wWVhSbElqcDdJa1JKVTBGQ1RFVkVJam9pWkdsellXSnNaV1FpTENKSlRsTlVRVXhNUlVRaU9pSnBibk4wWVd4c1pXUWlMQ0pPVDFSZlNVNVRWRUZNVEVWRUlqb2libTkwWDJsdWMzUmhiR3hsWkNKOUxDSlNkVzV1YVc1blUzUmhkR1VpT25zaVEwRk9UazlVWDFKVlRpSTZJbU5oYm01dmRGOXlkVzRpTENKU1JVRkVXVjlVVDE5U1ZVNGlPaUp5WldGa2VWOTBiMTl5ZFc0aUxDSlNWVTVPU1U1SElqb2ljblZ1Ym1sdVp5SjlmWDE5LDY1LC0xMjg1NTUxMywxLDEsLTEsMTY5OTk1NDg4NywxNjk5OTU0ODg3LDIwNzQ0NzAzOTYsMTI=; ADDRESSBOOKBAR_WEB_CLARIFICATION=1754302428; __Secure-refresh-token=8.35735018._c3oensMT7SJbDPErcMQtw.18.AfTtHHbYcWc1MJGRzCUmJ6mWayC0yyab-Du8-KvR1ADcPlIKsKaCAB99F2i9bUEynnFBQ8HJuC_ReggLwzaLFWv-bxoX3KVGh76kx0olgOBFawcpo-_tZwvgTtKXHbPLow.20190607103900.20250804174428.CuBrayjrMY1Gg1pySZ3h7RiOmvI48q0XhSjx0YJ_8Mw.19108b920aa4f88f4; __Secure-access-token=8.35735018._c3oensMT7SJbDPErcMQtw.18.AfTtHHbYcWc1MJGRzCUmJ6mWayC0yyab-Du8-KvR1ADcPlIKsKaCAB99F2i9bUEynnFBQ8HJuC_ReggLwzaLFWv-bxoX3KVGh76kx0olgOBFawcpo-_tZwvgTtKXHbPLow.20190607103900.20250804174428.jfFz5m2qfnKFGIa_vc57T5jdeUrC7O0-Ld_IBbpqMSo.1d48760636d9497af'


class Parser {
    constructor(params) {
        this.domain = params.domain;
        this.waitUntil = params.waitUntil;
    }

    parseCookies(cookieStr) {
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
    async processAllBlocks({ page, block, selectors }) {
        return page.$$eval(
            block,
            (blocks, selectors) => {
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
                    return data;
                });
            },
            selectors // Передаем объект селекторов как аргумент
        );
    }


    async getTextFromSelector({ url, selector }) {
        const browser = await puppeteer.launch({
            headless: true, // 👈 обязательно false
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        );

        const cookies = this.parseCookies(cookiesString);
        await page.setCookie(...cookies);

        console.log(url)

        await page.goto(url, {
            waitUntil: this.waitUntil,
            timeout: 0
        });

        await page.waitForSelector(selector.block)

        // Обрабатываем все блоки с помощью вынесенной логики
        const result = await this.processAllBlocks({
            page,
            selectors: selector.selectors,
            block: selector.block
        });
        await browser.close();

        return result;
    }
}


module.exports = {
    Parser
};