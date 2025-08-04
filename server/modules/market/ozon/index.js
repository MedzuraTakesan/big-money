const { searchText } = require("./api.js")

const search = async (productName) => {
    try {
        const response = await searchText(productName)
        return response
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    search
}