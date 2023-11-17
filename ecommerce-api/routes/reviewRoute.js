const express = require('express')
const { getReview, createReview } = require('../controllers/reviewContoller')

const router = express.Router()

router.get('/:productId/review',getReview)
router.post('/:productId/review',createReview)


module.exports = router