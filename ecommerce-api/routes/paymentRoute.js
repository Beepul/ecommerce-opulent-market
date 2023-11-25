const express = require('express')
const { getAllPayments, getPayment, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController')

const router = express.Router()



router.get('/',getAllPayments) 
router.get('/:userId',getPayment) 
router.post('/:userId',createPayment)
router.put('/:userId/:paymentId',updatePayment)
router.delete('/:userId/:paymentId',deletePayment)

module.exports = router