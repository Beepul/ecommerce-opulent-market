const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Address = require('../models/addressModel')


// Get all address
const getAllUserAddress = asyncHandler(async (req,res)=>{

    const addresses = await Address.find().populate({
        path: 'user',
        select: '-password'
    })

    if(!addresses || addresses.length <= 0){
        res.status(400)
        throw new Error('No Address found')
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
        res.status(400)
        throw new Error('User does not exist')
    }

    const address = await Address.find({user: userId}).populate({
        path: 'user',
        select: '-password'
    })

    if(!address || address.length <= 0){
        res.status(400)
        throw new Error(`No address found of user ${userId}`)
    }

    res.status(200).json({
        message: 'success',
        address
    })

})

// Create new Address
const createUserAddress = asyncHandler(async (req,res) => {
    const {userId} = req.params
    const {street,city,state,postalCode,country} = req.body

    if(!street || !city || !state || !postalCode || !country || !userId){
        res.status(400)
        throw new Error("All fields are required")
    }

    if(isNaN(parseFloat(postalCode)) || !isFinite(postalCode)){
        res.status(400)
        throw new Error('Please provide valid postal code')
    }

    const user = await User.findById(userId)

    if(!user){
        res.status(400)
        throw new Error('User does not exist')
    }

    const addressExist = await Address.find({user: userId})

    if(addressExist.length >=1 || addressExist){
        await Address.deleteMany({user: userId})
    }

    const address = await Address.create({
        user: user._id,
        street,
        city,
        state,
        postalCode,
        country
    })

    if(user && address){
        res.status(201).json({
            message: "success",
            address
        })
    }else{
        res.status(400)
        throw new Error('Please provide valid data')
    }

})

// Update address
const updateUserAddress = asyncHandler(async (req,res) => {
    const {userId,addressId} = req.params
    const {street,city,state,postalCode,country} = req.body

    let address = await Address.findById(addressId)

    if(!address){
        res.status(400)
        throw new Error('Address not found')
    }

    if(userId !== address.user.toString()){
        res.status(401)
        throw new Error('User and the address author doesnot match')
    }

    address.street = street || address.street 
    address.city = city || address.city 
    address.state = state || address.state 
    address.postalCode = postalCode || address.postalCode
    address.country = country || address.country

    await address.save()

    if(!address){
        res.status(400)
        throw new Error('Address not found')
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
        res.status(404)
        throw new Error('User doesnot exits')
    }

    const address = await Address.findById(addressId)

    if(!address){
        res.status(404)
        throw new Error('Address not found')
    }

    if(user._id.toString() !== address.user.toString()){
        res.status(401)
        throw new Error('user doesnot match with this address')
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