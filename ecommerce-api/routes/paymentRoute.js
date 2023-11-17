const express = require('express')
const { getAllPayments, getPayment, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController')

const router = express.Router()



router.get('/payment',getAllPayments)
router.get('/:userId/payment',getPayment)
router.post('/:userId/payment',createPayment)
router.put('/:userId/payment/:paymentId',updatePayment)
router.delete('/:userId/payment/:paymentId',deletePayment)

module.exports = router