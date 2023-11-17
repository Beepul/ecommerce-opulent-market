const express = require('express')
const { getTotalSales, getBestSellingProduct, getCustomerLocation } = require('../controllers/statsController')

const router = express.Router()

router.get('/total-sales',getTotalSales)
router.get('/best-selling-product',getBestSellingProduct)
router.get('/customer-location',getCustomerLocation)

module.exports = router