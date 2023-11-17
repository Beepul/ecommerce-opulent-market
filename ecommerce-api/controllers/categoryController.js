const asyncHandler = require('express-async-handler')
const Category = require('../models/categoryModel')

// GET ALL CATEGORY
const getAllCategory = asyncHandler(async (req,res) => {
    const category = await Category.find()
    if(category){
        res.status(200).json({
            category,
            message: "success"
        })
    }else{
        res.status(400)
        throw new Error("Something went wrong")
    }
})

// GET Single CATEGORY
const getCategory = asyncHandler(async (req,res) => {
    const {id} = req.params

    const category = await Category.findById(id)
    if(category){
        res.status(200).json({
            category,
            message: "success"
        })
    }else{
        res.status(400)
        throw new Error("Something went wrong")
    }
})

// Create New Category
const createCategory = asyncHandler(async (req,res) => {
    const {name,parent} = req.body 
    if(!name){
        res.status(400)
        throw new Error("Category is required")
    }
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
        res.status(400);
        throw new Error("Category with the same name already exists");
    }
    // Check if the parent category exists
    let parentCategory = null;
    if (parent) {
        parentCategory = await Category.findById(parent);
        if (!parentCategory) {
            return res.status(400).json({ message: 'Parent category not found' });
        }
    }

    // Create a new category
    const newCategory = new Category({
        name,
        parent: parentCategory ? parentCategory._id : null,
        children: [],
    });

    // Save the new category to the database
    await newCategory.save();

    // If a parent category exists, update its children array
    if (parentCategory) {
        parentCategory.children.push(newCategory._id);
        await parentCategory.save();
    }

    // Send a success response
    res.status(201).json({ message: "success", category: newCategory });

})

// Update Category
const updateCategory = asyncHandler(async (req,res) => {
    const {id} = req.params
    const {name,parent,children} = req.body 

    if(!name){
        res.status(400)
        throw new Error("Name of category is required")
    }

    const existingCategory = await Category.find({name})

    if(existingCategory.length < 0){
        res.status(400)
        throw new Error("Category name already exist")
    }

    let category = await Category.findById(id);
    if (!category) {
        res.status(400)
        throw new Error("Category not found")
    }

    // If a new parent is provided, update the parent's children array
    if (parent && parent.toString() !== category.parent.toString()) {
        const oldParentCategory = await Category.findById(category.parent);
        const newParentCategory = await Category.findById(parent);

        if (oldParentCategory) {
            oldParentCategory.children = oldParentCategory.children.filter(childId => childId.toString() !== id);
            await oldParentCategory.save();
        }

        if (newParentCategory) {
            newParentCategory.children.push(id);
            await newParentCategory.save();
        }
    }

    // Update the category
    category.name = name || category.name;
    category.parent = parent || category.parent;
    category.children = children || category.children;

    await category.save();

    // Send a success response
    res.status(200).json({ message:"success", category });

})

// Delete Category
const deleteCategory = asyncHandler(async (req,res) => {
    const {id} = req.params
    const existingCategory = await Category.findById(id)
    if(!existingCategory){
        res.status(400)
        throw new Error("category donot exist")
    }

    let parentCategory = null

    if(existingCategory.parent){
        parentCategory = await Category.findById(existingCategory.parent)
        if(parentCategory){
            parentCategory.children = parentCategory.children.filter(childId => {
                return childId.toString() !== id
            })
            await parentCategory.save()
        }
    }

    await Category.updateMany({ parent: id }, { $set: { parent: null } });
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