const express = require('express')
const { getAllCategory, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { validateToken, isAdmin } = require('../middleware/auth')
const router = express.Router()

router.get('/' , getAllCategory)
router.get('/:id', getCategory)
router.post('/', validateToken , isAdmin ,createCategory)
router.put('/:id', validateToken , isAdmin , updateCategory)
router.delete('/:id', validateToken , isAdmin , deleteCategory)







module.exports = router