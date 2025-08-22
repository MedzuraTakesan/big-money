// Кэш для регулярных выражений
const priceRegex = /[₽\s\u00A0]/g;
const reviewsRegex = /\s/g;
const numbersRegex = /(\d+)/;

const priceToNumber = (price) => {
    if (!price) return 0;
    return Number(price.replace(priceRegex, ''));
}

const extractReviewsCount = (reviewsText) => {
    if (!reviewsText) return 0;
    
    // Извлекаем число из текста отзывов/оценок
    // Примеры: "123 отзыва", "1 отзыв", "20 423 отзыва", "10 оценок", "отзывы (456)", "456", "3 оценки"
    // Убираем пробелы между цифрами и извлекаем все цифры
    const numbersOnly = reviewsText.replace(reviewsRegex, '').match(numbersRegex);
    return numbersOnly ? Number(numbersOnly[1]) : 0;
}

// Функция для очистки названия товара
const cleanProductName = (name, marketplace) => {
    if (!name) return '';
    
    let cleanedName = name.trim();
    
    // Специальная обработка для Wildberries
    if (marketplace === 'wildberries') {
        // Убираем разделитель " / " и все что до него (бренд)
        cleanedName = cleanedName.replace(/^[^/]*\/\s*/, '');
        // Убираем лишние пробелы
        cleanedName = cleanedName.replace(/\s+/g, ' ').trim();
        
        // Если название пустое после обработки, возвращаем оригинал
        if (!cleanedName) {
            cleanedName = name.trim();
        }
    }
    
    return cleanedName;
}

// Оптимизированная функция для обработки массива продуктов
const processProducts = (products, marketplace) => {
    return products.map(element => {
        // Очищаем название товара
        const cleanName = cleanProductName(element.name, marketplace);
        
        // Обрабатываем цену и скидку
        const price = priceToNumber(element.price);
        const sale = priceToNumber(element.sale);
        
        // Для Wildberries: если есть sale, то это актуальная цена, а price - старая
        let finalPrice = price;
        let finalSale = sale;
        
        if (marketplace === 'wildberries' && sale > 0 && price > 0) {
            finalPrice = sale; // Актуальная цена
            finalSale = price; // Старая цена (скидка)
        }
        
        return {
            ...element,
            marketplace,
            name: cleanName,
            price: finalPrice,
            sale: finalSale,
            reviewsCount: extractReviewsCount(element.reviews)
        };
    });
}

module.exports = {
    priceToNumber,
    extractReviewsCount,
    cleanProductName,
    processProducts
}