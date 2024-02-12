const express = require('express')
const { isAdmin, validateToken } = require('../middleware/auth')
const { getAllTransaction } = require('../controllers/transactionController')

const router = express.Router()

router.get('/', validateToken, isAdmin, getAllTransaction)

module.exports = router