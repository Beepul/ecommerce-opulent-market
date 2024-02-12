const express = require('express')
const { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController')
const { validateToken, isAdmin } = require('../middleware/auth')
const router = express.Router()

router.get('/' , validateToken,getAllOrders)
router.get('/:id', validateToken , isAdmin , getOrder)
router.post('/', validateToken , createOrder)
router.put('/:id', validateToken , isAdmin , updateOrder)
router.delete('/:id', validateToken , isAdmin ,deleteOrder)







module.exports = router