const { searchText } = require("./api.js")
const { processProducts } = require('../helpers/data/formatting.js')

const search = async (productName) => {
    try {
        const response = await searchText(productName)
        return processProducts(response, 'wildberries');
    } catch (error) {
        console.error(error)
        return [];
    }
}

module.exports = {
    search
}