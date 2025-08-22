const { browserManager } = require('./browser-manager.js');

class Parser {
    constructor(params) {
        this.domain = params.domain;
        this.cookie = this.parseCookies(params.cookie);
        this.waitUntil = params.waitUntil || 'domcontentloaded';
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

    // Универсальная функция подгрузки по скроллу
    async scrollToLoadMore(page, options = {}) {
        const {
            maxScrolls = 2,
            scrollDelay = 300,
            scrollStep = 0.4,
            targetElements = null,
            minElements = 10
        } = options;

        console.log(`🔄 Начинаем подгрузку контента (максимум ${maxScrolls} прокруток)`);
        
        let scrollCount = 0;
        let previousHeight = 0;
        let elementsCount = 0;

        while (scrollCount < maxScrolls) {
            // Получаем текущую высоту страницы
            const currentHeight = await page.evaluate(() => document.body.scrollHeight);
            
            // Если высота не изменилась, возможно достигли конца
            if (currentHeight === previousHeight && scrollCount > 0) {
                console.log(`📏 Высота страницы не изменилась, возможно достигли конца`);
                break;
            }

            // Прокручиваем страницу
            await page.evaluate((step) => {
                window.scrollTo(0, document.body.scrollHeight * step);
            }, scrollStep);

            // Ждем загрузки контента
            await this.wait(scrollDelay);

            // Проверяем количество элементов если указан селектор
            if (targetElements) {
                const newElementsCount = await page.$$eval(targetElements, elements => elements.length);
                console.log(`📊 Найдено элементов: ${newElementsCount}`);
                
                if (newElementsCount >= minElements && newElementsCount === elementsCount && scrollCount > 0) {
                    console.log(`✅ Достигнуто минимальное количество элементов (${minElements})`);
                    break;
                }
                elementsCount = newElementsCount;
            }

            previousHeight = currentHeight;
            scrollCount++;
        }

        console.log(`✅ Завершена подгрузка контента (${scrollCount} прокруток)`);
    }

    // Метод для обработки всех блоков на странице
    async processAllBlocks({ page, block, selectors = {}, links = {}, imgs = {} }) {
        // Добавляем отладочную информацию
        const blockCount = await page.$$eval(block, blocks => blocks.length);
        console.log(`Found ${blockCount} blocks with selector: ${block}`);
        
        if (blockCount === 0) {
            console.warn(`No blocks found with selector: ${block}`);
            
            return [];
        }
        
        return page.$$eval(
            block,
            (blocks, { selectors, links, imgs}) => {
                return blocks.map((element, index) => {
                    const data = {};
                    
                    // Обрабатываем селекторы
                    for (const [key, selector] of Object.entries(selectors)) {
                        try {
                            // Поддержка множественных селекторов
                            const selectorList = selector.split(',').map(s => s.trim());
                            let el = null;
                            
                            for (const sel of selectorList) {
                                el = element.querySelector(sel);
                                if (el) break;
                            }
                            
                            data[key] = el ? el.textContent.trim() : null;
                        } catch (error) {
                            console.error(`Error processing selector ${key}:`, error);
                            data[key] = null;
                        }
                    }

                    // Обрабатываем ссылки
                    for (const [key, link] of Object.entries(links)) {
                        try {
                            const selectorList = link.split(',').map(s => s.trim());
                            let el = null;
                            
                            for (const sel of selectorList) {
                                el = element.querySelector(sel);
                                if (el) break;
                            }
                            
                            data[key] = el ? el.href : null;
                        } catch (error) {
                            console.error(`Error processing selector ${key}:`, error);
                            data[key] = null;
                        }
                    }

                    // Обрабатываем изображения
                    for (const [key, img] of Object.entries(imgs)) {
                        try {
                            const selectorList = img.split(',').map(s => s.trim());
                            let el = null;
                            
                            for (const sel of selectorList) {
                                el = element.querySelector(sel);
                                if (el) break;
                            }
                            
                            data[key] = el ? el.src : null;
                        } catch (error) {
                            console.error(`Error processing selector ${key}:`, error);
                            data[key] = null;
                        }
                    }
                    
                    // Добавляем отладочную информацию для первых элементов
                    if (index < 3) {
                        console.log(`Block ${index + 1}:`, {
                            name: data.name ? data.name.substring(0, 50) + '...' : 'No name',
                            price: data.price || 'No price',
                            sale: data.sale || 'No sale',
                            reviews: data.reviews || 'No reviews'
                        });
                    }
                    
                    return data;
                });
            },
            {
                selectors,
                links,
                imgs
            }
        );
    }

    // Вспомогательная функция для ожидания
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getTextFromSelector({ url, selector, skipScroll = false, timeout = 12000, aggressiveOptimization = false, scrollOptions = {} }) {
        const browser = await browserManager.getBrowser();
        const page = await browser.newPage();
        
        try {
            // Увеличенное разрешение для лучшей работы в headless режиме
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );

            // Специальные настройки для headless режима
            await page.evaluateOnNewDocument(() => {
                // Эмулируем реальный браузер для headless режима
                if (!Object.getOwnPropertyDescriptor(navigator, 'webdriver')) {
                    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                }
                if (!Object.getOwnPropertyDescriptor(navigator, 'plugins')) {
                    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
                }
                if (!Object.getOwnPropertyDescriptor(navigator, 'languages')) {
                    Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU', 'ru', 'en'] });
                }
                
                // Эмулируем размер экрана
                if (!Object.getOwnPropertyDescriptor(screen, 'width')) {
                    Object.defineProperty(screen, 'width', { get: () => 1920 });
                }
                if (!Object.getOwnPropertyDescriptor(screen, 'height')) {
                    Object.defineProperty(screen, 'height', { get: () => 1080 });
                }
                if (!Object.getOwnPropertyDescriptor(screen, 'availWidth')) {
                    Object.defineProperty(screen, 'availWidth', { get: () => 1920 });
                }
                if (!Object.getOwnPropertyDescriptor(screen, 'availHeight')) {
                    Object.defineProperty(screen, 'availHeight', { get: () => 1040 });
                }
                
                // Эмулируем события мыши для лучшей совместимости
                window.addEventListener('scroll', () => {
                    // Триггерим события для ленивой загрузки
                    const event = new Event('scroll', { bubbles: true });
                    window.dispatchEvent(event);
                });
            });

            // Блокировка ресурсов только при включенной агрессивной оптимизации
            if (aggressiveOptimization) {
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                    const resourceType = req.resourceType();
                    const url = req.url();
                    
                    // Блокируем только изображения и шрифты при агрессивной оптимизации
                    if (['image', 'font'].includes(resourceType) || 
                        url.includes('analytics') || 
                        url.includes('tracking')) {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });
            }

            if (this.cookie.length) {
                await page.setCookie(...this.cookie);
            }

            // Используем стратегию ожидания из конструктора
            await page.goto(url, {
                waitUntil: this.waitUntil,
                timeout: timeout
            });

            // Дополнительное ожидание для Wildberries
            if (url.includes('wildberries.ru')) {         
                // Показываем текущий URL и заголовок страницы
                const pageTitle = await page.title();
                const currentUrl = page.url();
                console.log(`📄 Заголовок страницы: ${pageTitle}`);
                console.log(`🔗 Текущий URL: ${currentUrl}`);
                
                // Дополнительная прокрутка для загрузки ленивого контента
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight * 0.3);
                });
                await this.wait(1000);
                
                // Проверяем наличие элементов на странице
                const bodyText = await page.evaluate(() => document.body.innerText);
                console.log(`📝 Длина текста на странице: ${bodyText.length} символов`);
            }

            // Специальная обработка для Ozon в headless режиме
            if (url.includes('ozon.ru')) {
                console.log('🔄 Специальная обработка для Ozon...');
                
                // Дополнительная инициализация для Ozon
                await page.evaluate(() => {
                    // Эмулируем взаимодействие пользователя
                    const event = new Event('DOMContentLoaded', { bubbles: true });
                    document.dispatchEvent(event);
                    
                    // Эмулируем события мыши
                    const mouseEvent = new MouseEvent('mousemove', {
                        bubbles: true,
                        cancelable: true,
                        clientX: 100,
                        clientY: 100
                    });
                    document.dispatchEvent(mouseEvent);
                    
                    // Триггерим загрузку ленивого контента
                    setTimeout(() => {
                        window.scrollTo(0, 100);
                        setTimeout(() => {
                            window.scrollTo(0, 0);
                        }, 100);
                    }, 500);
                });
                
                await this.wait(1000);
                
                // Дополнительная эмуляция взаимодействия
                await page.mouse.move(100, 100);
                await page.mouse.wheel({ deltaY: 100 });
                await this.wait(500);
            }

            // Улучшенное ожидание селектора с множественными вариантами
            const blockSelectors = selector.block.split(',').map(s => s.trim());
            let selectorFound = false;
            
            console.log(`Trying selectors for ${url}:`, blockSelectors);
            
            // Сначала проверяем, есть ли элементы сразу
            for (const blockSelector of blockSelectors) {
                try {
                    const count = await page.$$eval(blockSelector, elements => elements.length);
                    if (count > 0) {
                        selectorFound = true;
                        console.log(`✅ Found ${count} elements with selector: ${blockSelector}`);
                        break;
                    }
                } catch (error) {
                    console.warn(`❌ Selector ${blockSelector} not found, trying next...`);
                }
            }
            
            // Если элементы не найдены сразу, ждем их появления
            if (!selectorFound) {
                console.log('⏳ Elements not found immediately, waiting for them...');
                for (const blockSelector of blockSelectors) {
                    try {
                        await page.waitForSelector(blockSelector, { timeout: 5000 });
                        const count = await page.$$eval(blockSelector, elements => elements.length);
                        if (count > 0) {
                            selectorFound = true;
                            console.log(`✅ Found ${count} elements with selector: ${blockSelector} after waiting`);
                            break;
                        }
                    } catch (error) {
                        console.warn(`❌ Selector ${blockSelector} not found after waiting, trying next...`);
                    }
                }
            }

            // Используем универсальную функцию подгрузки по скроллу
            if (!skipScroll) {
                // Специальные настройки скролла для Ozon в headless режиме
                let scrollOptionsFinal = scrollOptions;
                if (url.includes('ozon.ru')) {
                    scrollOptionsFinal = {
                        ...scrollOptions,
                        maxScrolls: scrollOptions.maxScrolls || 3, // Увеличиваем для Ozon
                        scrollDelay: scrollOptions.scrollDelay || 500, // Увеличиваем задержку
                        scrollStep: scrollOptions.scrollStep || 0.3, // Уменьшаем шаг
                        minElements: scrollOptions.minElements || 8
                    };
                    console.log('🔧 Применяем специальные настройки скролла для Ozon');
                }
                
                await this.scrollToLoadMore(page, {
                    maxScrolls: scrollOptionsFinal.maxScrolls || 2,
                    scrollDelay: scrollOptionsFinal.scrollDelay || 300,
                    scrollStep: scrollOptionsFinal.scrollStep || 0.4,
                    targetElements: selector.block,
                    minElements: scrollOptionsFinal.minElements || 10
                });
            }

            // Обрабатываем все блоки
            const result = await this.processAllBlocks({
                page,
                ...selector
            });

            return result;
        } finally {
            await page.close();
            browserManager.returnBrowser(browser);
        }
    }

    // Статический метод для закрытия всех браузеров
    static async closeAllBrowsers() {
        await browserManager.closeAllBrowsers();
    }
}

module.exports = {
    Parser
};