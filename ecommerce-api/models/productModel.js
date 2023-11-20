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

productSchema.pre('save', async function (next) {
    try {
        const reviews = await mongoose.model('Review').find({ _id: { $in: this.reviews } });

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            this.averageRating = totalRating / reviews.length;
        } else {
            this.averageRating = 0;
        }

        next();
    } catch (error) {
        next(error);
    }
});


const Product = mongoose.model('Product',productSchema)

module.exports = Product