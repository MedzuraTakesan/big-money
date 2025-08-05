const { searchText } = require("./api.js")
const { priceToNumber } = require('../helpers/data/formatting.js')

const search = async (productName) => {
    try {
        const response = await searchText(productName)
        return response.map(element => ({
            ...element,
            marketplace: 'wildberries',
            name: element.name.replace('/', '').trim(),
            price: priceToNumber(element.price),
            sale: priceToNumber(element.sale)
        }))
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    search
}