const express = require('express')
const { getAllUserAddress, getUserAddress, createUserAddress, updateUserAddress, deleteUserAddress } = require('../controllers/addressController')
const { validateToken, isAdmin } = require('../middleware/auth')

const router = express.Router()


router.get('/', validateToken, isAdmin ,getAllUserAddress)
router.get('/:userId', validateToken ,getUserAddress)
router.post('/', validateToken , createUserAddress)
router.put('/:userId/:addressId', validateToken , isAdmin ,updateUserAddress)
router.delete('/:userId/:addressId', validateToken , isAdmin ,deleteUserAddress)






module.exports = router