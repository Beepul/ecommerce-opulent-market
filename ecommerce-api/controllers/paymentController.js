const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Payment = require('../models/paymentSchema')

// GET ALL PAYMENTS
const getAllPayments = asyncHandler(async (req,res) => {
    res.send("All payments")
})

// GET Single PAYMENT
const getPayment = asyncHandler(async (req,res) => {
    res.send("Single payment")
})

// Create New Payment
const createPayment = asyncHandler(async (req,res) => {
    const {userId} = req.params
    const {amount,paymentMethod} = req.body

    
    if(!paymentMethod || !userId){
        res.status(400)
        throw new Error('All fields required')
    }

    if(paymentMethod === 'Cash'){
        res.status(400)
        throw new Error('Cash on delivery is not accepted at the moment, Please try using Online payment.')
    }
    
    const user = await User.findById(userId)
    
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }
    
    let details = {}

    if(paymentMethod === 'Online'){
        if(!amount){
            res.status(400)
            throw new Error('Amount is required')
        }
        if (isNaN(parseFloat(amount)) || !isFinite(amount)) {
            res.status(400);
            throw new Error("Price must be a valid number");
        }

        details = {
            user: user._id,
            amount,
            paymentMethod
        }
    }else{
        details = {
            user: user._id,
            amount: null,
            paymentMethod
        }
    }

    const paymentDetails = await Payment.create({
        ...details
    })

    if(paymentDetails){
        res.status(201).json({
            message: "success",
            paymentDetails
        })
    }else{
        res.status(400)
        throw new Error('Please provide valid details')
    }
})

// Update Payment
const updatePayment = asyncHandler(async (req,res) => {
    res.send("Update payment")
})

// Delete Payment
const deletePayment = asyncHandler(async (req,res) => {
    res.send("Delete payment")
})

module.exports = {
    getAllPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment
}