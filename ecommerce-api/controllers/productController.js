const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')

// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req,res) => {
    let query = {}

    // filtering by category
    if(req.query.category){
        const categoryIds = req.query.category.split(',')
        query.category = {$in: categoryIds}
    }

    // filtering by price range
    if(req.query.minPrice && req.query.maxPrice){
        query.price = {$gte: parseFloat(req.query.minPrice), $lte: parseFloat(req.query.maxPrice)}
    }
    
    // Sorting by price name rating sac desc
    let sortOptions = {}

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    const products = await Product.find(query).sort(sortOptions).populate("category").populate("reviews")
    if(products.length <= 0){
        res.status(400)
        throw new Error("No products has been created yet")
    }
    res.status(200).json({
        message: "success",
        products
    })
})

// GET Single PRODUCT
const getProduct = asyncHandler(async (req,res) => {
    const {id} = req.params

    const product = await Product.findById(id).populate('category').populate('reviews')

    if(product){
        res.status(200).json({
            message: "success",
            product
        })
    }else{
        res.status(400)
        throw new Error("Product not available")
    }

})

// Create New Product
const createProduct = asyncHandler(async (req,res) => {
    const {name,description,price,image,stockQuantity,category} = req.body

    if(!name || !description || !image || !category){
        res.status(400)
        throw new Error("All fields required")
    }
    if (isNaN(parseFloat(price)) || !isFinite(price)) {
        res.status(400);
        throw new Error("Price must be a valid number");
    }

    if (isNaN(parseFloat(stockQuantity)) || !isFinite(stockQuantity) || stockQuantity <= 0) {
        res.status(400);
        throw new Error("Stock must be a valid number greater than 0");
    }

    if (category.length === 0) {
        res.status(400);
        throw new Error("At least one category must be selected");
    }
    const existingCategory = await Category.find({_id:{$in: category}})

    if(existingCategory.length !== category.length){
        res.status(400)
        throw new Error("One or more categories do not exist")
    }

    const product = await Product.create({
        name,
        description,
        price,
        image,
        stockQuantity,
        category
    })

    if(product){
        res.status(201).json({
            product,
            message: "Product created sucessfully"
        })
    }else{
        res.status(400)
        throw new Error("Please provide valid data")
    }
})

// Update Product
const updateProduct = asyncHandler(async (req,res) => {
    const {name,description,price,image,stockQuantity,category} = req.body
    const {id} = req.params

    if (isNaN(parseFloat(price)) || !isFinite(price)) {
        res.status(400);
        throw new Error("Price must be a valid number");
    }

    if (isNaN(parseFloat(stockQuantity)) || !isFinite(stockQuantity) || stockQuantity <= 0) {
        res.status(400);
        throw new Error("Stock must be a valid number greater than 0");
    }

    let product = await Product.findById(id)

    if(!product){
        res.status(400)
        throw new Error(`Product with id ${id} not found`)
    }

    product.name = name || product.name 
    product.description = description || product.description
    product.price = price || product.price 
    product.image = image || product.image 
    product.stockQuantity = stockQuantity || product.stockQuantity 

    if(category.length > 0 ){
        const existingCategory = await Category.find({_id:{$in: category}})
    
        if(existingCategory.length !== category.length || existingCategory.length <= 0){
            res.status(400)
            throw new Error("One or more categories do not exist")
        }

        product.category = category
    }

    product = await product.save()

    if(product){
        res.status(200).json({
            message: "success",
            product
        })
    }else{
        res.status(400)
        throw new Error("please provide valid data")
    }


})

// Delete Product
const deleteProduct = asyncHandler(async (req,res) => {
    const {id} = req.params

    const product = await Product.findById(id)

    if(!product){
        res.status(400)
        throw new Error(`Product not found with id ${id}`)
    }

    await Product.findByIdAndDelete(id)

    res.status(200).json({
        message: `Product with id ${id} has been deleted`
    })
})

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}