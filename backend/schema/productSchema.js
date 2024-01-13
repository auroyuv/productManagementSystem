const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : String,
    description : String,
    price : String,
    maxQuantity : Number,
    category : String,
    weight : Number,
    image: String,
    reviews: [{
        user: String,
        comment: String
    }],
    admin: String,
});

module.exports = mongoose.model('products', productSchema)