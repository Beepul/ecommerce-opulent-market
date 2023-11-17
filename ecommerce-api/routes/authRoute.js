const express = require('express')
const { registerUser, registerAdmin, login, logout } = require('../controllers/authController')
const router = express.Router()

router.post('/register', registerUser)
router.post('/admin/register', registerAdmin)
router.post('/login', login)
router.post('/logout', logout)



module.exports = router