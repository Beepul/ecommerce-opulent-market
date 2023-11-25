const express = require('express')
const { getTotalSales, getBestSellingProduct, getCustomerLocation, getProfileLoss, getMostActiveUser, getTopCategoryBySales } = require('../controllers/statsController')

const router = express.Router()

router.get('/total-sales',getTotalSales)
router.get('/total-profile-loss',getProfileLoss)
router.get('/best-selling-product',getBestSellingProduct)
router.get('/top-categories',getTopCategoryBySales)
router.get('/customer-location',getCustomerLocation)
router.get('/most-active-customer', getMostActiveUser)

module.exports = router