const express = require('express')
const { getTotalSales, getBestSellingProduct, getCustomerLocation, getMostActiveUser, getTopCategoryBySales, getTotalUsers, getProfitLoss } = require('../controllers/statsController')
const { validateToken, isAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/total-sales', validateToken , isAdmin ,getTotalSales)
router.get('/total-user', validateToken, isAdmin, getTotalUsers)
router.get('/total-profit-loss', validateToken , isAdmin ,getProfitLoss)
router.get('/best-selling-product',getBestSellingProduct)
router.get('/top-categories',getTopCategoryBySales)
router.get('/customer-location', validateToken , isAdmin ,getCustomerLocation)
router.get('/most-active-customer', validateToken , isAdmin , getMostActiveUser)

module.exports = router