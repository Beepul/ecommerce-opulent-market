const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Address = require('../models/addressModel')
const BError = require('../utils/error')


// Get all address
const getAllUserAddress = asyncHandler(async (req,res)=>{

    const addresses = await Address.find().populate({
        path: 'user',
        select: '-password'
    })

    if(!addresses || addresses.length <= 0){
        throw new BError('No Address found',400)
    }

    res.status(200).json({
        message: 'success',
        addresses
    })
})


// Get user address
const getUserAddress = asyncHandler(async (req,res) => {
    const {userId} = req.params

    const user = await User.findById(userId)

    if(!user){
        throw new BError('User does not exist',400)
    }

    const address = await Address.find({user: userId}).populate({
        path: 'user',
        select: '-password'
    })

    if(!address || address.length <= 0){
        throw new BError(`No address found of user ${userId}`,400)
    }

    res.status(200).json({
        message: 'success',
        address
    })

})

// Create new Address
const createUserAddress = asyncHandler(async (req,res) => {
    try {
        const userId = req.userId
        const {street,city,state,postalCode,country} = req.body
    
        if(!street || !city || !state || !postalCode || !country){
            throw new BError("All fields are required",400)
        }
    
        if(isNaN(parseFloat(postalCode)) || !isFinite(postalCode)){
            throw new BError('Please provide valid postal code',400)
        }
    
        const user = await User.findById(userId)
    
        if(!user){
            throw new BError('User does not exist',400)
        }
    
    
        const address = await Address.create({
            user: user._id,
            street,
            city,
            state,
            postalCode,
            country
        })
    
        res.status(201).json({
            message: "success",
            address
        })
        
    } catch (error) {
        throw new BError(error.message || 'Please provide valid data', 400)
    }


})

// Update address
const updateUserAddress = asyncHandler(async (req,res) => {
    const {userId,addressId} = req.params
    const {street,city,state,postalCode,country} = req.body

    let address = await Address.findById(addressId)

    if(!address){
        throw new BError('Address not found',400)
    }

    if(userId !== address.user.toString()){
        throw new BError('User and the address author doesnot match',401)
    }

    address.street = street || address.street 
    address.city = city || address.city 
    address.state.code = state.code || address.state.code
    address.state.name = state.name || address.state.name
    address.postalCode = postalCode || address.postalCode
    address.country.code = country.code || address.country.code
    address.country.name = country.name || address.country.name

    await address.save()

    if(!address){
        throw new BError('Address not found',400)
    }

    res.status(200).json({
        message: 'success',
        address
    })


})

const deleteUserAddress = asyncHandler(async (req,res) => {
    const {userId,addressId} = req.params

    const user = await User.findById(userId)

    if(!user){
        throw new BError('User doesnot exits',404)
    }

    const address = await Address.findById(addressId)

    if(!address){
        throw new BError('Address not found',404)
    }

    if(user._id.toString() !== address.user.toString()){
        throw new BError('user doesnot match with this address',400)
    }

    await Address.findByIdAndDelete(address._id)

    res.status(200).json({
        message: 'success'
    })
})

module.exports = {
    getAllUserAddress,
    getUserAddress,
    updateUserAddress,
    deleteUserAddress,
    createUserAddress
}