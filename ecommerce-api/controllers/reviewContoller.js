const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const Review = require('../models/reviewModel')
const User = require('../models/userModel')
const Order = require('../models/orderModel')
const BError = require('../utils/error')

const getReview = asyncHandler(async (req,res) => {
    const {productId} = req.params

    const product = await Product.findById(productId).populate('reviews');

    if(!product){
        throw new BError(`Product with id ${id} not found`,400)
    }

    const reviews = product.reviews;
    res.status(200).json({
        message: "success",
        reviews
    })
})

const createReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = req.userId;
    const { rating, content } = req.body;

    if (!rating || !content || !productId) {
        throw new BError('Please provide all the fields', 400);
    }

    if (isNaN(parseFloat(rating)) || !isFinite(rating)) {
        throw new BError('Rating must be a valid number',400);
    }

    if (parseFloat(rating) < 1 || parseFloat(rating) > 5) {
        throw new BError('Rating must be between 1 to 5',400);
    }

    const orders = await Order.find({ user, status: 'delivered' });
    

    let hasPurchased = false;


    for (const order of orders) {
        const items = order.items;

        for (const item of items) {
            if (item.product.toString() === productId) {
                hasPurchased = true;
                break;
            }
        }

        if (hasPurchased) {
            break;
        }
    }


    if (!hasPurchased) {
        throw new BError('You must purchase the product in order to review it.',400);
    }

    const product = await Product.findById(productId).populate('reviews');

    if (!product) {
        throw new BError(`Product not found with id ${productId}`,404);
    }

    const reviewExist = product.reviews.find((item) => item.user.toString() === user)
    
    if(reviewExist){
        throw new BError('You have already reviewed this product! Cannot review twice.', 400)
    }
    
    const review = await Review.create({
        user,
        rating,
        content,
        product: product._id,
    });

    product.reviews.push(review._id);
    product.save();

    res.status(201).json({
        message: 'success',
        review,
    });
});


module.exports = {
    getReview,
    createReview
}