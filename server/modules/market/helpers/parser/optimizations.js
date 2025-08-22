// Дополнительные оптимизации для парсинга

// Улучшенные селекторы для разных маркетплейсов
const optimizedSelectors = {
    ozon: {
        block: '.tile-root',
        selectors: {
            sale: '.tsHeadline500Medium',
            price: '.c35_3_1-b',
            name: '.tsBody500Medium',
            reviews: 'span[style*="color:var(--textSecondary)"]'
        },
        links: {
            cardLink: 'a.tile-clickable-element'
        },
        imgs: {
            cardImg: '.tile-clickable-element img'
        }
    },
    wildberries: {
        // Обновленные селекторы на основе актуальной верстки
        block: '.product-card',
        selectors: {
            sale: 'span>ins',
            price: 'span>del',
            name: '.product-card__name',
            reviews: '.product-card__count'
        },
        links: {
            cardLink: '.product-card__link'
        },
        imgs: {
            cardImg: '.product-card__img-wrap > img'
        }
    }
};

// Настройки скролла для разных маркетплейсов
const scrollConfigs = {
    ozon: {
        maxScrolls: 3,        // Увеличено для headless режима
        scrollDelay: 500,     // Увеличено для стабильности
        scrollStep: 0.3,      // Уменьшено для лучшего покрытия
        minElements: 12       // Уменьшено для быстрого завершения
    },
    wildberries: {
        maxScrolls: 2,
        scrollDelay: 100,
        scrollStep: 0.4,
        minElements: 12
    }
};

// Кэш для результатов парсинга (опционально)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// Функция для получения кэшированного результата
const getCachedResult = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
};

// Функция для сохранения результата в кэш
const setCachedResult = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

// Функция для очистки устаревших записей кэша
const cleanupCache = () => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            cache.delete(key);
        }
    }
};

// Запускаем очистку кэша каждые 10 минут
setInterval(cleanupCache, 10 * 60 * 1000);

// Функция для создания ключа кэша
const createCacheKey = (marketplace, productName) => {
    return `${marketplace}:${productName.toLowerCase().trim()}`;
};

// Функция для быстрого парсинга без скролла
const quickSearch = async (parser, url, marketplace, productName) => {
    const selector = optimizedSelectors[marketplace];
    if (!selector) {
        throw new Error(`Unknown marketplace: ${marketplace}`);
    }

    const startTime = Date.now();
    
    try {
        const products = await parser.getTextFromSelector({
            url,
            selector,
            skipScroll: true, // Пропускаем скролл для ускорения
            timeout: 8000,
            aggressiveOptimization: false
        });

        const endTime = Date.now();
        console.log(`${marketplace} - Быстрый поиск: ${endTime - startTime}ms`);
        
        return products;
    } catch (error) {
        console.error(`Error quick parsing ${marketplace}:`, error);
        return [];
    }
};

// Функция для оптимизированного парсинга с кэшированием
const optimizedSearch = async (parser, url, marketplace, productName, skipScroll = false) => {
    const cacheKey = createCacheKey(marketplace, productName);
    
    // Проверяем кэш
    const cached = getCachedResult(cacheKey);
    if (cached) {
        console.log(`Using cached result for ${productName}`);
        return cached;
    }

    const selector = optimizedSelectors[marketplace];
    if (!selector) {
        throw new Error(`Unknown marketplace: ${marketplace}`);
    }

    const startTime = Date.now();
    
    try {
        // Получаем настройки скролла для маркетплейса
        const scrollOptions = scrollConfigs[marketplace] || {};
        
        // Улучшенные настройки для ускорения
        const products = await parser.getTextFromSelector({
            url,
            selector,
            skipScroll,
            timeout: 8000,
            aggressiveOptimization: false, // Отключаем агрессивную оптимизацию
            scrollOptions
        });

        const endTime = Date.now();
        console.log(`${marketplace} - Время выполнения: ${endTime - startTime}ms`);

        // Сохраняем в кэш
        setCachedResult(cacheKey, products);
        
        return products;
    } catch (error) {
        console.error(`Error parsing ${marketplace}:`, error);
        return [];
    }
};

// Новая функция для параллельного парсинга с приоритизацией
const parallelOptimizedSearch = async (parsers, urls, marketplaces, productName) => {
    const startTime = Date.now();
    
    // Запускаем все парсеры параллельно
    const promises = parsers.map((parser, index) => {
        const marketplace = marketplaces[index];
        
        return parser.search(productName)
            .then(result => ({ marketplace, result, success: true }))
            .catch(error => ({ marketplace, result: [], success: false, error }));
    });

    const results = await Promise.allSettled(promises);
    
    const endTime = Date.now();
    console.log(`Общее время параллельного парсинга: ${endTime - startTime}ms`);
    
    return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(item => item.success)
        .flatMap(item => item.result);
};

module.exports = {
    getCachedResult,
    setCachedResult,
    cleanupCache,
    optimizedSelectors,
    scrollConfigs,
    createCacheKey,
    optimizedSearch,
    parallelOptimizedSearch,
    quickSearch
};
