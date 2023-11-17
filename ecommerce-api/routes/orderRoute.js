const express = require('express')
const { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController')
const router = express.Router()

router.get('/', getAllOrders)
router.get('/:id', getOrder)
router.post('/', createOrder)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)







module.exports = router