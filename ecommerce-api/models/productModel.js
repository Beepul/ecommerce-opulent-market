const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true,
        maxLength: [150,"Description must be less than 150 characters"]
    },
    price: {
        type: Number,
        required: true 
    },
    image:{
        type: String,
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true ,
        min: 0
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true 
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    totalQuantitySold: {
        type: Number,
        default: 0
    }
})


const Product = mongoose.model('Product',productSchema)

module.exports = Product