const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel');
const {imageUploader, getImagePublicId, deleteImageFromCloudinary} = require('../utils/cloudinary');
const cloudinary = require('cloudinary')
const BError = require('../utils/error')



// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req,res) => {
    let query = {}

    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 3;
    const skip = page * perPage;

    

    // filtering by category
    if(req.query.category){
        const categoryIds = req.query.category.split(',')
        query.category = {$in: categoryIds}
    }

    // filtering by price range
    if(req.query.minPrice && req.query.maxPrice){
        query.price = {$gte: parseFloat(req.query.minPrice), $lte: parseFloat(req.query.maxPrice)}
    }

    // Filtering by rating
    if (req.query.rating) {
        const rating = parseFloat(req.query.rating);
        query.averageRating = { $gte: rating }
    }

    // Adding search by name functionality
    if (req.query.search) {
        query.name = { $regex: new RegExp(req.query.search, 'i') };
    }
    
    // Sorting by price name rating sac desc
    let sortOptions = {}

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    const products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(perPage)
        .populate("category")
        .populate("reviews")

    const count = await Product.countDocuments(query);

    const minMaxPrices = await Product.aggregate([
        {
            $group: {
                _id: null,
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const { minPrice, maxPrice } = minMaxPrices[0];

    
 
    res.status(200).json({
        message: "success",
        products,
        count,
        minPrice,
        maxPrice
    })
})

// GET Single PRODUCT
const getProduct = asyncHandler(async (req,res) => {
    const {id} = req.params

    const product = await Product.findById(id)
        .populate('category')
        .populate({
            path: 'reviews',
            populate: {path: 'user', select: '_id name email pic'}
        })

    if(product){
        res.status(200).json({
            message: "success",
            product
        })
    }else{
        res.status(400)
        throw new BError("Product not available")
    }

})

// Create New Product

const createProduct = asyncHandler(async (req,res) => {

    const {name,description,price,discountPercentage,stockQuantity,category,isFeatured,offer} = req.body

    if(!name || !description || !category || category.length <= 0){
        throw new BError("All fields required",400)
    }
    if(!req.body.images || req.body.images.length <= 0 ){
        throw new BError("Please select an image",400)
    }
    if (isNaN(parseFloat(price)) || !isFinite(price)) {
        throw new BError("Price must be a valid number",400);
    }

    if (isNaN(parseFloat(stockQuantity)) || !isFinite(stockQuantity) || stockQuantity <= 0) {
        throw new BError("Stock must be a valid number greater than 0",400);
    }

  
    
    const existingCategory = await Category.find({_id:{$in: category}})

   

    if(existingCategory.length !== category.length){
        throw new BError("One or more categories do not exist",400)
    }

    

    let images = []

    if(typeof req.body.images === 'string'){
        images.push(req.body.images)
    }else{
        images = req.body.images
    }
    
    const imageLinks = []

    for(let i = 0; i < images.length ; i++){
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'seven-shop'
        })

        imageLinks.push({
            public_id: result.public_id,
            url: result.url
        })
    }

    let productData = {
        name,
        description,
        price,
        discountPercentage,
        images: imageLinks,
        stockQuantity,
        category,
        isFeatured,
        offer
    }

    const product = await Product.create(productData)

    if(product){
        res.status(201).json({
            product,
            message: "Product created sucessfully"
        })
    }else{
        throw new BError("Please provide valid data",400)
    }
})

// Update Product
const updateProduct = asyncHandler(async (req,res) => {

    const {id} = req.params

    const {name,description,price,discountPercentage,images,stockQuantity,category,isFeatured,offer,oldImages} = req.body

    if(!name || !description || !category || category.length <= 0){
        throw new BError("All fields required",400)
    }
    if(!req.body.images || req.body.images.length <= 0 ){
        throw new BError("Please select an image",400)
    }
    if (isNaN(parseFloat(price)) || !isFinite(price)) {
        throw new BError("Price must be a valid number",400);
    }

    if (isNaN(parseFloat(stockQuantity)) || !isFinite(stockQuantity) || stockQuantity <= 0) {
        throw new BError("Stock must be a valid number greater than 0",400);
    }

    let product = await Product.findById(id)

    if(!product){
        throw new BError(`Product with id ${id} not found`, 400)
    }


    if(images && images[0].public_id){
        product.images = images
    }else {
        if(oldImages && oldImages.length > 0){
            for (const img of images){
                await cloudinary.v2.uploader.destroy(img)
            }
        }
        const newImages = []
        if(images && images.length > 0){
            for(const img of images){
                const imageResult = await cloudinary.v2.uploader.upload(img,{
                    folder: 'seven-shop'
                })
                newImages.push({
                    public_id: imageResult.public_id,
                    url: imageResult.url
                })
            }
        }
        product.images = newImages
    }

    product.name = name || product.name 
    product.description = description || product.description
    product.price = price || product.price
    product.discountPercentage = discountPercentage || product.discountPercentage
    product.stockQuantity = stockQuantity || product.stockQuantity
    product.category = category || product.category
    product.isFeatured = isFeatured || product.isFeatured
    product.offer = {
        isOffered: offer?.isOffered || product.offer.isOffered,
        offerStartDate: offer?.offerStartDate || product.offer.offerStartDate,
        offerEndDate: offer?.offerEndDate || product.offer.offerEndDate,
    } 

    await product.save()

    res.status(200).json({
        message: 'success',
        product
    })
})

// Delete Product
const deleteProduct = asyncHandler(async (req,res) => {
    try {
        const {id} = req.params
    
        const product = await Product.findById(id)
    
        if(!product){
            throw new BError(`Product not found with id ${id}`,400)
        }

        const public_ids = []

        for(const img of product?.images){
            public_ids.push(img.public_id)
        }
    
        for (const public_id of public_ids){
            const result = await cloudinary.v2.uploader.destroy(public_id)
            console.log("RESULT::", result)
        }
    
        await Product.findByIdAndDelete(id)
    
        res.status(200).json({
            message: `Product with id ${id} has been deleted`
        })
    } catch (error) {
        throw new BError(error.message || 'Internal Server Error', 400)
    }
})

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}