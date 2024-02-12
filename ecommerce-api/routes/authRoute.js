const express = require('express')
const { signUp, registerAdmin, login, logout, activateUser, getRefreshToken, autoLogin, updateUser, updatePassword, passwordRestLink, resetPassword } = require('../controllers/authController')
const { validateToken } = require('../middleware/auth')
const router = express.Router()

router.post('/', signUp)
router.get('/activation/:token', activateUser)
router.post('/admin/register', registerAdmin)
router.get('/refresh-token', getRefreshToken)
router.post('/login', login)
router.post('/logout',logout)
router.get('/auto-login', autoLogin)
router.put('/update/user', validateToken ,updateUser)
router.put('/update/password', validateToken , updatePassword)
router.post('/password-rest-link' , passwordRestLink)
router.put('/reset-password' , resetPassword)




module.exports = router