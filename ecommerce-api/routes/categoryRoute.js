const express = require('express')
const { getAllCategory, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const router = express.Router()

router.get('/', getAllCategory)
router.get('/:id', getCategory)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)







module.exports = router