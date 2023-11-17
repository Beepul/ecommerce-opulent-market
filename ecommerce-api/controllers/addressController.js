const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Address = require('../models/addressModel')

const getAllUserAddress = asyncHandler(async (req,res)=>{
    res.send("All Address")
})

const getUserAddress = asyncHandler(async (req,res) => {
    res.send("User Address")
})

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

const updateUserAddress = asyncHandler(async (req,res) => {
    res.send("Update User Address")
})

const deleteUserAddress = asyncHandler(async (req,res) => {
    res.send("Delete users address")
})

module.exports = {
    getAllUserAddress,
    getUserAddress,
    updateUserAddress,
    deleteUserAddress,
    createUserAddress
}