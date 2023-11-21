const express = require('express')
const { getAllUserAddress, getUserAddress, createUserAddress, updateUserAddress, deleteUserAddress } = require('../controllers/addressController')

const router = express.Router()


router.get('/',getAllUserAddress)
router.get('/:userId',getUserAddress)
router.post('/:userId', createUserAddress)
router.put('/:userId/:addressId', updateUserAddress)
router.delete('/:userId/:addressId', deleteUserAddress)






module.exports = router