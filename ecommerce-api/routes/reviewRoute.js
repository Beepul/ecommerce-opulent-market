const express = require('express')
const { getReview, createReview } = require('../controllers/reviewContoller')
const { validateToken } = require('../middleware/auth')

const router = express.Router()

router.get('/:productId',getReview)
router.post('/:productId', validateToken ,createReview)


module.exports = router