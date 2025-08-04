const ozon = require('./ozon/index.js')

const getProductsFromName = async (productName) => {
    const responseFromOzon = await ozon.search(productName)

    return responseFromOzon
}

module.exports = {
    getProductsFromName
}