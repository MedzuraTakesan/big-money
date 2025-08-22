const market = require('./modules/market/index.js')
const express = require('express');
const app = express();
app.use(express.json())

const getProducts = async (request, response) => {
    const search = request.query.search;
    const sortBy = request.query.sortBy || 'reviews'; // reviews, price, name

    if (!search) {
        response.json([])
    }

    const products = await market.getProductsFromName(search, sortBy)

    response.json(products)
}



app.get('/get-products', getProducts);

app.listen(3005, () => {
    console.log('Server started on port 3000');
});