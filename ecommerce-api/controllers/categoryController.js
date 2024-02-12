const asyncHandler = require('express-async-handler')
const Category = require('../models/categoryModel')
const cloudinary = require('cloudinary')
const Product = require('../models/productModel');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');
const BError = require('../utils/error');

// GET ALL CATEGORY
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        // Retrieve all categories
        const categories = await Category.find();

        const newCategories = await Promise.all(categories.map(async (cat) => {
            const productCount = await Product.countDocuments({ category: cat._id });
            cat = cat.toObject(); 
            cat.count = productCount || 0;
            return cat;
        }));

        res.status(200).json({
            categories: newCategories,
            total: newCategories.length,
            message: "success"
        });

    } catch (error) {
        throw new BError(error.message || "Internal Server Error", 400)
    }
});


// GET Single CATEGORY
const getCategory = asyncHandler(async (req,res) => {
    const {id} = req.params

    const category = await Category.findById(id).populate("children").populate("parent")
    if(category){
        res.status(200).json({
            category,
            message: "success"
        })
    }else{
        throw new BError("Category not found",404)
    }
})

// Create New Category
const createCategory = asyncHandler(async (req,res) => {
    const {name,image} = req.body 

    if(!name || !image){
        throw new BError("All Feilds Required",400)
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
        throw new BError("Category with the same name already exists",400);
    }

    const imageResult = await cloudinary.v2.uploader.upload(image, {
        folder: 'seven-shop'
    })

    // // Create a new category
    const category = await Category.create({
        name,
        image: {
            public_id: imageResult.public_id,
            url: imageResult.url
        }
    });

    // // Send a success response
    res.status(201).json({ message: "success", category });

})

// Update Category
const updateCategory = asyncHandler(async (req,res) => {

    const {id} = req.params
    const {name,image,oldImageId} = req.body 

    if(!name || !image ){
        throw new BError("All Feilds Required",400)
    }

    
    let category = await Category.findById(id);

    if (!category) {
        throw new BError("Category not found",400)
    }

    if(image && image.public_id){
        category.name = name
        category.image = category.image
    }else{
        if(oldImageId){
            await cloudinary.v2.uploader.destroy(oldImageId)
        }
        const imageResult = await cloudinary.v2.uploader.upload(image, {
            folder: 'seven-shop'
        })
        category.name = name 
        category.image = {
            public_id: imageResult.public_id,
            url: imageResult.url,
        }
    }

    await category.save()

    res.status(200).json({
        message: 'success',
        category
    })

})

// Delete Category
const deleteCategory = asyncHandler(async (req,res) => {
    const {id} = req.params

    const existingCategory = await Category.findById(id)

    if(!existingCategory){
        throw new BError("category donot exist",400)
    }

    await cloudinary.v2.uploader.destroy(existingCategory.image.public_id)

    await Category.findByIdAndDelete(id)

    res.status(200).json({
        message: "Category deleted sucessfully"
    })
})

module.exports = {
    getAllCategory,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}