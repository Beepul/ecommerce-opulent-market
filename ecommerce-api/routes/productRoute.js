const express = require('express')
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const { validateToken, isAdmin } = require('../middleware/auth')
const router = express.Router()

router.get('/', getAllProducts)
router.get('/:id', getProduct)
router.post('/' , validateToken , isAdmin ,createProduct)
router.put('/:id', validateToken , isAdmin ,updateProduct)
router.delete('/:id', validateToken, isAdmin ,deleteProduct)







module.exports = router