const express = require('express')
const { getAllUserAddress, getUserAddress, createUserAddress, updateUserAddress, deleteUserAddress } = require('../controllers/addressController')

const router = express.Router()


router.get('/address',getAllUserAddress)
router.get('/:userId/address',getUserAddress)
router.post('/:userId/address', createUserAddress)
router.put('/:userId/address/:addressId', updateUserAddress)
router.delete('/:userId/address/:addressId', deleteUserAddress)






module.exports = router