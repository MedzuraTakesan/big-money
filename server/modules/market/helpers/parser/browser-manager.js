const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

class BrowserManager {
    constructor() {
        this.browserPool = [];
        this.maxBrowsers = 3; // Увеличено для лучшей производительности
        this.isShuttingDown = false;
        this.initializationPromises = new Map(); // Для предотвращения дублирования инициализации
    }

    async getBrowser() {
        if (this.isShuttingDown) {
            throw new Error('Browser manager is shutting down');
        }

        if (this.browserPool.length > 0) {
            return this.browserPool.pop();
        }
        
        if (this.browserPool.length < this.maxBrowsers) {
            // Проверяем, не инициализируется ли уже браузер
            const initKey = `browser_${this.browserPool.length}`;
            if (this.initializationPromises.has(initKey)) {
                return await this.initializationPromises.get(initKey);
            }

            const initPromise = this.createBrowser();
            this.initializationPromises.set(initKey, initPromise);
            
            try {
                const browser = await initPromise;
                this.initializationPromises.delete(initKey);
                return browser;
            } catch (error) {
                this.initializationPromises.delete(initKey);
                throw error;
            }
        }
        
        // Ждем освобождения браузера с таймаутом
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout waiting for available browser'));
            }, 5000); // Уменьшенный таймаут

            const checkPool = () => {
                if (this.browserPool.length > 0) {
                    clearTimeout(timeout);
                    resolve(this.browserPool.pop());
                } else if (!this.isShuttingDown) {
                    setTimeout(checkPool, 50); // Уменьшенный интервал проверки
                } else {
                    clearTimeout(timeout);
                    reject(new Error('Browser manager is shutting down'));
                }
            };
            checkPool();
        });
    }

    async createBrowser() {
        const browser = await puppeteer.launch({
            headless: true, // Headless режим
            slowMo: 50, // Уменьшено для ускорения
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--memory-pressure-off',
                '--max_old_space_size=4096',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-default-browser-check',
                '--safebrowsing-disable-auto-update',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--disable-domain-reliability',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-print-preview',
                '--disable-speech-api',
                '--disable-threaded-animation',
                '--disable-threaded-scrolling',
                '--disable-3d-apis',
                '--disable-accelerated-video-decode',
                '--disable-accelerated-video-encode',
                '--disable-software-rasterizer',
                '--disable-smooth-scrolling',
                '--disable-low-res-tiling',
                '--disable-partial-raster',
                '--disable-checker-imaging',
                '--disable-image-animation-resync',
                '--disable-new-tab-first-run',
                '--disable-hang-monitor',
                '--disable-prompt-on-repost',
                '--disable-sync-preferences',
                '--disable-background-mode',
                '--disable-component-extensions-with-background-pages',
                '--disable-ipc-flooding-protection',
                '--disable-renderer-backgrounding',
                '--force-color-profile=srgb',
                '--metrics-recording-only',
                '--password-store=basic',
                '--use-mock-keychain',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1920,1080', // Увеличено разрешение
                '--start-maximized', // Максимизируем окно
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-print-preview',
                '--disable-speech-api',
                '--disable-threaded-animation',
                '--disable-threaded-scrolling',
                '--disable-3d-apis',
                '--disable-accelerated-video-decode',
                '--disable-accelerated-video-encode',
                '--disable-software-rasterizer',
                '--disable-smooth-scrolling',
                '--disable-low-res-tiling',
                '--disable-partial-raster',
                '--disable-checker-imaging',
                '--disable-image-animation-resync',
                '--disable-new-tab-first-run',
                '--disable-hang-monitor',
                '--disable-prompt-on-repost',
                '--disable-sync-preferences',
                '--disable-background-mode',
                '--disable-component-extensions-with-background-pages',
                '--disable-ipc-flooding-protection',
                '--disable-renderer-backgrounding',
                '--force-color-profile=srgb',
                '--metrics-recording-only',
                '--password-store=basic',
                '--use-mock-keychain',
                '--disable-blink-features=AutomationControlled'
            ]
        });
        return browser;
    }

    returnBrowser(browser) {
        if (this.isShuttingDown) {
            browser.close();
            return;
        }

        if (this.browserPool.length < this.maxBrowsers) {
            this.browserPool.push(browser);
        } else {
            browser.close();
        }
    }

    async closeAllBrowsers() {
        this.isShuttingDown = true;
        
        // Очищаем все промисы инициализации
        this.initializationPromises.clear();
        
        for (const browser of this.browserPool) {
            try {
                await browser.close();
            } catch (error) {
                console.error('Error closing browser:', error);
            }
        }
        this.browserPool = [];
    }

    getPoolSize() {
        return this.browserPool.length;
    }

    // Новый метод для получения статистики
    getStats() {
        return {
            poolSize: this.browserPool.length,
            maxBrowsers: this.maxBrowsers,
            isShuttingDown: this.isShuttingDown,
            initializationPromises: this.initializationPromises.size
        };
    }
}

// Синглтон для глобального доступа
const browserManager = new BrowserManager();

module.exports = {
    BrowserManager,
    browserManager
};
