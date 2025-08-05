const priceToNumber = (price) => {
    return price ? Number(price.replace(/[₽\s\u00A0]/g, '')): 0
}

module.exports = {
    priceToNumber
}