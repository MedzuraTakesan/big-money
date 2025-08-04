const market = require('./modules/market/index.js')


const getProducts = async (productName) => {
    const products = await market.getProductsFromName(productName)

    return products
}


const test = async (text) => {
    const result = await getProducts(text)

    console.log(result)
}

test('airpods pro')