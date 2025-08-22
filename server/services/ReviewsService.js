const { browserManager } = require('../modules/market/helpers/parser/browser-manager');

class ReviewsService {
    constructor() {
        // Используем существующий browser-manager
    }

    /**
     * Определяет маркетплейс по URL
     * @param {string} url - URL товара
     * @returns {string} название маркетплейса
     */
    detectMarketplace(url) {
        if (url.includes('wildberries.ru') || url.includes('wb.ru')) {
            return 'wildberries';
        } else if (url.includes('ozon.ru')) {
            return 'ozon';
        }
        throw new Error('Неподдерживаемый маркетплейс');
    }

    /**
     * Преобразует URL товара в URL отзывов для Wildberries
     * @param {string} productUrl - URL товара
     * @returns {string} URL отзывов
     */
    getWildberriesReviewsUrl(productUrl) {
        // Извлекаем ID товара из URL
        const match = productUrl.match(/\/catalog\/(\d+)\//);
        if (!match) {
            throw new Error('Не удалось извлечь ID товара из URL Wildberries');
        }
        const productId = match[1];
        return `https://www.wildberries.ru/catalog/${productId}/feedbacks`;
    }

    /**
     * Парсит отзывы с Wildberries
     * @param {string} reviewsUrl - URL страницы отзывов
     * @returns {Array} массив отзывов
     */
    async parseWildberriesReviews(reviewsUrl) {
        const browser = await browserManager.getBrowser();
        const page = await browser.newPage();
        
        try {
            console.log(`Переходим на страницу отзывов Wildberries: ${reviewsUrl}`);
            
            // Используем те же настройки, что и в парсинге товаров
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );

            // Устанавливаем куки для Wildberries (если есть)
            const { wildberries } = require('../modules/market/helpers/parser/constants.js');
            const parser = new (require('../modules/market/helpers/parser/index.js').Parser)({
                domain: wildberries.domain,
                waitUntil: wildberries.waitUntil,
                cookie: wildberries.cookie
            });
            
            if (parser.cookie.length) {
                await page.setCookie(...parser.cookie);
                console.log('🍪 Установлены куки для Wildberries');
            }

            // Специальные настройки для headless режима (как в парсинге товаров)
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

            // Используем стратегию ожидания как в парсинге товаров
            await page.goto(reviewsUrl, {
                waitUntil: 'networkidle2',
                timeout: 12000
            });

            // Дополнительное ожидание для Wildberries (как в парсинге товаров)
            // Показываем текущий URL и заголовок страницы
            const pageTitle = await page.title();
            const currentUrl = page.url();
            console.log(`📄 Заголовок страницы: ${pageTitle}`);
            console.log(`🔗 Текущий URL: ${currentUrl}`);
            
            // Дополнительная прокрутка для загрузки ленивого контента
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight * 0.3);
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Проверяем наличие элементов на странице
            const bodyText = await page.evaluate(() => document.body.innerText);
            console.log(`📝 Длина текста на странице: ${bodyText.length} символов`);
            
            // Пробуем разные селекторы для отзывов
            const reviews = await page.evaluate(() => {
                const reviews = [];
                
                // Попытка 1: основной селектор
                let reviewElements = document.querySelectorAll('.comments__item.feedback');
                
                // Попытка 2: альтернативные селекторы
                if (reviewElements.length === 0) {
                    reviewElements = document.querySelectorAll('.feedback');
                }
                
                // Попытка 3: поиск по классам, содержащим "feedback"
                if (reviewElements.length === 0) {
                    reviewElements = document.querySelectorAll('[class*="feedback"]');
                }
                
                // Попытка 4: поиск по структуре отзывов
                if (reviewElements.length === 0) {
                    reviewElements = document.querySelectorAll('li[class*="comments"]');
                }
                
                console.log(`Найдено элементов отзывов Wildberries: ${reviewElements.length}`);
                
                reviewElements.forEach((element, index) => {
                    if (index >= 32) return; // Максимум 32 отзыва
                    
                    try {
                        let author = 'Аноним';
                        let text = '';
                        let rating = 0;
                        
                        // Попытки получить имя автора
                        const authorSelectors = [
                            '.feedback__header',
                            '[class*="header"]',
                            '[class*="author"]',
                            '[class*="name"]',
                            '.feedback__author'
                        ];
                        
                        for (const selector of authorSelectors) {
                            const authorElement = element.querySelector(selector);
                            if (authorElement && authorElement.textContent.trim()) {
                                author = authorElement.textContent.trim();
                                break;
                            }
                        }
                        
                        // Попытки получить текст отзыва
                        const textSelectors = [
                            '.feedback__text .feedback__text--item',
                            '.feedback__text',
                            '[class*="text"]',
                            '[class*="content"]',
                            'p',
                            'span'
                        ];
                        
                        for (const selector of textSelectors) {
                            const textElement = element.querySelector(selector);
                            if (textElement && textElement.textContent.trim()) {
                                const textContent = textElement.textContent.trim();
                                if (textContent.length > 10) { // Минимальная длина отзыва
                                    text = textContent;
                                    break;
                                }
                            }
                        }
                        
                        // Попытки получить рейтинг
                        const ratingSelectors = [
                            '.feedback__rating',
                            '[class*="rating"]',
                            '[class*="star"]',
                            '.stars'
                        ];
                        
                        for (const selector of ratingSelectors) {
                            const ratingElement = element.querySelector(selector);
                            if (ratingElement) {
                                const ratingClass = ratingElement.className;
                                if (ratingClass.includes('star5')) rating = 5;
                                else if (ratingClass.includes('star4')) rating = 4;
                                else if (ratingClass.includes('star3')) rating = 3;
                                else if (ratingClass.includes('star2')) rating = 2;
                                else if (ratingClass.includes('star1')) rating = 1;
                                
                                if (rating > 0) break;
                            }
                        }
                        
                        if (text && text.length > 10) {
                            reviews.push({
                                author,
                                text,
                                rating
                            });
                        }
                    } catch (error) {
                        console.error('Ошибка при парсинге отзыва Wildberries:', error);
                    }
                });
                
                return reviews;
            });
            
            console.log(`Успешно получено отзывов с Wildberries: ${reviews.length}`);
            return reviews;
        } catch (error) {
            console.error('Ошибка при парсинге отзывов Wildberries:', error);
            return [];
        } finally {
            await page.close();
            browserManager.returnBrowser(browser);
        }
    }

    /**
     * Парсит отзывы с Ozon
     * @param {string} productUrl - URL товара
     * @returns {Array} массив отзывов
     */
    async parseOzonReviews(productUrl) {
        const browser = await browserManager.getBrowser();
        const page = await browser.newPage();
        
        try {
            // Используем те же настройки, что и в парсинге товаров
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );

            // Устанавливаем куки для Ozon (как в парсинге товаров)
            const { ozon } = require('../modules/market/helpers/parser/constants.js');
            const parser = new (require('../modules/market/helpers/parser/index.js').Parser)({
                domain: ozon.domain,
                waitUntil: ozon.waitUntil,
                cookie: ozon.cookie
            });
            
            if (parser.cookie.length) {
                await page.setCookie(...parser.cookie);
                console.log('🍪 Установлены куки для Ozon');
            }

            // Специальные настройки для headless режима (как в парсинге товаров)
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

            // Используем стратегию ожидания как в парсинге товаров
            await page.goto(productUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 12000
            });

            // Специальная обработка для Ozon (как в парсинге товаров)
            console.log('🔄 Специальная обработка для Ozon...');
            
            // Показываем текущий URL и заголовок страницы
            const pageTitle = await page.title();
            const currentUrl = page.url();
            console.log(`📄 Заголовок страницы: ${pageTitle}`);
            console.log(`🔗 Текущий URL: ${currentUrl}`);
            
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
            
            // Ждем загрузки основного контента
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Дополнительная эмуляция взаимодействия
            await page.mouse.move(100, 100);
            await page.mouse.wheel({ deltaY: 100 });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Используем простой скролл как в парсинге товаров
            console.log('🔄 Начинаем подгрузку отзывов...');
            
            // Простой скролл вниз для загрузки отзывов
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight * 0.8);
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Еще один скролл для полной загрузки
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Проверяем, не заблокировали ли нас
            const bodyText = await page.evaluate(() => document.body.innerText);
            console.log(`📝 Длина текста на странице: ${bodyText.length} символов`);
            
            // Проверяем на признаки блокировки
            if (bodyText.includes('Доступ ограничен') || 
                bodyText.includes('Access denied') || 
                bodyText.includes('blocked') ||
                bodyText.includes('captcha') ||
                bodyText.length < 1000) {
                console.warn('⚠️ Возможная блокировка Ozon, пробуем обойти...');
            }
            
            // Пробуем разные селекторы для отзывов
            const reviews = await page.evaluate(() => {
                const reviews = [];
                
                // Попытка 1: основной селектор
                let reviewElements = document.querySelectorAll('[data-review-uuid]');
                
                // Попытка 2: альтернативные селекторы
                if (reviewElements.length === 0) {
                    reviewElements = document.querySelectorAll('.vo7_30');
                }
                
                // Попытка 3: поиск по классам, содержащим "review"
                if (reviewElements.length === 0) {
                    reviewElements = document.querySelectorAll('[class*="review"]');
                }
                
                // Попытка 4: поиск по структуре отзывов
                if (reviewElements.length === 0) {
                    reviewElements = document.querySelectorAll('div[class*="vo7"]');
                }
                
                // Попытка 5: поиск по более общим селекторам
                if (reviewElements.length === 0) {
                    reviewElements = document.querySelectorAll('[class*="feedback"]');
                }
                
                console.log(`Найдено элементов отзывов: ${reviewElements.length}`);
                
                reviewElements.forEach((element, index) => {
                    if (index >= 32) return; // Максимум 32 отзыва
                    
                    try {
                        let author = 'Аноним';
                        let text = '';
                        let rating = 0;
                        
                        // Попытки получить имя автора
                        const authorSelectors = [
                            '.s2o_30',
                            '[class*="author"]',
                            '[class*="name"]',
                            'span[class*="s2"]',
                            '.feedback__author'
                        ];
                        
                        for (const selector of authorSelectors) {
                            const authorElement = element.querySelector(selector);
                            if (authorElement && authorElement.textContent.trim()) {
                                author = authorElement.textContent.trim();
                                break;
                            }
                        }
                        
                        // Попытки получить текст отзыва
                        const textSelectors = [
                            '.v1o_30',
                            '[class*="text"]',
                            '[class*="content"]',
                            'p',
                            'span',
                            '.feedback__text'
                        ];
                        
                        for (const selector of textSelectors) {
                            const textElement = element.querySelector(selector);
                            if (textElement && textElement.textContent.trim()) {
                                const textContent = textElement.textContent.trim();
                                if (textContent.length > 10) { // Минимальная длина отзыва
                                    text = textContent;
                                    break;
                                }
                            }
                        }
                        
                        // Попытки получить рейтинг
                        const ratingSelectors = [
                            '.v0o_30 svg[width="20"][height="20"]',
                            '[class*="rating"] svg',
                            '[class*="star"]',
                            'svg[width="20"][height="20"]',
                            '.feedback__rating'
                        ];
                        
                        for (const selector of ratingSelectors) {
                            const starElements = element.querySelectorAll(selector);
                            if (starElements.length > 0) {
                                rating = starElements.length;
                                break;
                            }
                        }
                        
                        // Если рейтинг не найден, пробуем по классам
                        if (rating === 0) {
                            const ratingElement = element.querySelector('[class*="rating"]');
                            if (ratingElement) {
                                const className = ratingElement.className;
                                if (className.includes('star5')) rating = 5;
                                else if (className.includes('star4')) rating = 4;
                                else if (className.includes('star3')) rating = 3;
                                else if (className.includes('star2')) rating = 2;
                                else if (className.includes('star1')) rating = 1;
                            }
                        }
                        
                        if (text && text.length > 10) {
                            reviews.push({
                                author,
                                text,
                                rating
                            });
                        }
                    } catch (error) {
                        console.error('Ошибка при парсинге отзыва:', error);
                    }
                });
                
                return reviews;
            });
            
            console.log(`Успешно получено отзывов с Ozon: ${reviews.length}`);
            return reviews;
        } catch (error) {
            console.error('Ошибка при парсинге отзывов Ozon:', error);
            return [];
        } finally {
            await page.close();
            browserManager.returnBrowser(browser);
        }
    }

    /**
     * Получает отзывы по URL товара
     * @param {string} productUrl - URL товара
     * @returns {Array} массив отзывов
     */
    async getReviews(productUrl) {
        try {
            const marketplace = this.detectMarketplace(productUrl);
            
            if (marketplace === 'wildberries') {
                const reviewsUrl = this.getWildberriesReviewsUrl(productUrl);
                return await this.parseWildberriesReviews(reviewsUrl);
            } else if (marketplace === 'ozon') {
                return await this.parseOzonReviews(productUrl);
            }
            
            return [];
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
            return [];
        }
    }
}

module.exports = ReviewsService;
