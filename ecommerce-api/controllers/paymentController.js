const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Payment = require('../models/paymentSchema')

// GET ALL PAYMENTS
const getAllPayments = asyncHandler(async (req,res) => {
    const paymentMethods = await Payment.find().populate('user')


    if(!paymentMethods || paymentMethods.length <= 0){
        res.status(400)
        throw new Error('No payment method has been created yet')
    }
    res.status(200).json({
        message: 'success',
        paymentMethods
    })
})

// GET Single PAYMENT
const getPayment = asyncHandler(async (req,res) => {
   const {userId} = req.params

   const paymentMethods = await Payment.find({user: userId}).populate('user')

    if(!paymentMethods || paymentMethods.length <= 0){
        res.status(400)
        throw new Error('No payment method has been created yet')
    }
    res.status(200).json({
        message: 'success',
        paymentMethods
    })
})

// Create New Payment
const createPayment = asyncHandler(async (req,res) => {
    const {userId} = req.params
    const {amount,paymentMethod} = req.body

    
    if(!paymentMethod || !userId){
        res.status(400)
        throw new Error('All fields required')
    }

    if(paymentMethod === 'cash'){
        res.status(400)
        throw new Error('Cash on delivery is not accepted at the moment, Please try using Online payment.')
    }
    
    const user = await User.findById(userId)
    
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }
    
    let details = {}

    if(paymentMethod === 'online'){
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
    const {userId,paymentId} = req.params
    const {amount,paymentMethod} = req.body

    if(paymentMethod !== 'online'){
        res.status(400)
        throw new Error('We only accept online payment at the moment')
    }

    const payment = await Payment.findById(paymentId)

    if(!payment){
        res.status(404)
        throw new Error('Payment not found')
    }

    const isValidUser = payment.user.toString() === userId ? true : false 

    if(!isValidUser){
        res.status(401)
        throw new Error('User doesnot match')
    }

    payment.amount = amount || payment.amount
    payment.paymentMethod = paymentMethod || payment.paymentMethod

    await payment.save()

    res.status(200).json({
        message: 'success',
        payment
    })

})

// Delete Payment
const deletePayment = asyncHandler(async (req,res) => {
    const {userId,paymentId} = req.params
    const payment = await Payment.findById(paymentId)

    if(!payment){
        res.status(404)
        throw new Error('Payment not found')
    }
    const isValidUser = payment.user.toString() === userId ? true : false 

    if(!isValidUser){
        res.status(401)
        throw new Error('User doesnot match')
    }

    await Payment.findByIdAndDelete(paymentId)

    res.status(200).json({
        message: `Product with id: ${paymentId} has been deleted`
    })
})

module.exports = {
    getAllPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment
}