const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const Review = require('../models/reviewModel')
const User = require('../models/userModel')

const getReview = asyncHandler(async (req,res) => {
    const {productId} = req.params

    const product = await Product.findById(productId).populate('reviews');

    if(!product){
        res.status(400)
        throw new Error(`Product with id ${id} not found`)
    }

    const reviews = product.reviews;
    res.status(200).json({
        message: "success",
        reviews
    })
})

const createReview = asyncHandler(async (req,res) => {
    const {productId} = req.params
    const {user,rating,content} = req.body

    if(!user || !rating || !content || !productId){
        res.status(400)
        throw new Error('Please provide all the field')
    }

    if (isNaN(parseFloat(rating)) || !isFinite(rating)) {
        res.status(400);
        throw new Error("Rating must be a valid number");
    }

    if(parseFloat(rating) < 1 || parseFloat(rating) > 5){
        res.status(400)
        throw new Error('Rating must be between 1 to 5')
    }

    const userExist = await User.findById(user)

    if(!userExist){
        res.status(400)
        throw new Error(`User not found with id ${user}`)
    }

    let product = await Product.findById(productId)

    if(!product){
        res.status(400)
        throw new Error(`Product not found with id ${productId}`)
    }

    const review = await Review.create({
        user,
        rating,
        content,
        product: product._id
    })

    if(!review){
        res.status(400)
        throw new Error('Please provide valid data')
    }

    product.reviews.push(review._id)
    product.save()

    if(product && review){
        res.status(201).json({
            message: "success",
            review
        })
    }else{
        res.status(400)
        throw new Error('Please provide valid data')
    }
})


module.exports = {
    getReview,
    createReview
}