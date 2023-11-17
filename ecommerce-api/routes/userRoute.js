const express = require('express')
const { getAllUser, getUser, updateUser } = require('../controllers/userController')

const router = express.Router()

router.get('/',getAllUser)
router.get('/:id',getUser)
router.put('/:id',updateUser)


module.exports = router