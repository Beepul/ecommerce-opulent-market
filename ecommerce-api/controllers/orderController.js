const asyncHandler = require('express-async-handler')
const Address = require('../models/addressModel')
const Order = require('../models/orderModel')
const Product = require('../models/productModel');
const User = require('../models/userModel');
const BError = require('../utils/error');
const Transaction = require('../models/transactionModel');
const { sendEmail } = require('../utils/mailer');




const validateProductStock = async (items,res) => {
    for (const item of items) {
        const product = await Product.findById(item._id);

        if (!product || product.stockQuantity < item.quantity) {
            throw new BError(`Insufficient stock for ${product.name}`, 400);
        }
    }
};

const updateProductStock = async (items) => {
    for (const item of items) {
        const product = await Product.findById(item._id);
        product.stockQuantity -= item.quantity;
        await product.save();
    }
};


// GET ALL ORDERS
const getAllOrders = asyncHandler(async (req,res) => {
    let query = {}

    if(req.query.user){
        query.user = req.query.user
    }

    try {
        const orders = await Order.find(query).populate('user','-password').populate({path: 'items.product', populate: {path: 'category'}}).populate('shippingAddress')
        
        res.status(200).json({
            message: 'success',
            orders
        })
        
    } catch (error) {
        throw new BError(error.message || 'Cannot get orders', 400)
    }
})

// GET Single ORDER
const getOrder = asyncHandler(async (req,res) => {
    const {id} = req.params 

    const order = await Order.findById(id).populate('shippingAddress').populate({
        path: 'items.product',
        model: 'Product', 
    });

    if(!order){
        throw new BError('Order not found',404)
    }

    res.status(200).json({
        message: 'success',
        order
    })
})

// Create New Order
const createOrder = asyncHandler(async (req, res) => {
    try {
        const user = req.userId 
        const {items , totalPrice  , shippingAddress } = req.body
    
        if(items.length <= 0){
            throw new BError('Product in your order is missing',400)
        }
    
        for (const item of items) {
            if (item.quantity <= 0) {
                throw new BError('Please increase the quantity of the product to purchase',400);
            }
        }
    
        const address = await Address.findById(shippingAddress)
    
        if(!address){
            throw new BError('Invalid shipping address',400)
        }

        const existUser = await User.findById(user)

        // console.log(items)
    
        await validateProductStock(items,res);
    
        const order = await Order.create({
            user,
            items: items.map((item) => {
                return {
                    product: item._id,
                    quantity: item.quantity
                }
            }),
            totalPrice,
            status: 'processing',
            shippingAddress,
            paymentDetails: {
                paymentMethod: 'cash',
                paymentStatus: 'due'
            },
        })
    
        await updateProductStock(items);

        sendEmail({
            email: existUser.email,
            subject: 'Seven Shop Purchase Confirm',
            message: `
                <h2>Hello ${existUser.name}</h2>
                <p>Thank you for choosing us. Your product will be on the way soon.</p>
                <p>Your total amount is $${totalPrice} </p>
            `
        })
        
        res.status(201).json({
            message: 'success',
            order
        })
        
    } catch (error) {
        throw new BError(error.message || 'Cannot create Order', 400)        
    }

});

// Update Order
const updateOrder = asyncHandler(async (req,res) => {
    const {id} = req.params 
    const {user,status,paymentDetails,deliveredAt} = req.body
    try {
        const existUser = await User.findById(user)
        let order = await Order.findById(id)
    
        if(!order){
            throw new BError('Order does not exist',400)
        }
    
        if(order.user.toString() !== existUser._id.toString()){
            throw new BError(`This order does not belogs to user you've provided `,400)
        }

        if(status === 'delivered' && paymentDetails?.paymentStatus === 'paid' && order.paymentDetails.paymentMethod === 'cash'){
            await Transaction.create({
                user,
                order: order._id,
                amount_subtotal: Number(order.totalPrice) - 20,
                shipping_cost: 20,
                amount: order.totalPrice,
                payment_status: 'paid',
                paidAt: Date.now(),
            })
        }
        
        order.status = status || order.status
        order.paymentDetails.paymentMethod = paymentDetails.paymentMethod ? paymentDetails.paymentMethod : order.paymentDetails.paymentMethod
        order.paymentDetails.paymentStatus = paymentDetails.paymentStatus ? paymentDetails.paymentStatus : order.paymentDetails.paymentStatus
        order.deliveredAt = deliveredAt || order.deliveredAt
    
        await order.save()
    
        res.status(200).json({
            message: "success",
            order: order
        })
        
    } catch (error) {
        throw new BError(error.message || 'Failed to update order', 400)
    }

})

// Delete Order
const deleteOrder = asyncHandler(async (req,res) => {
    const {id} = req.params 

    const order = await Order.findById(id)

    if(!order){
        throw new BError('Order not found',404)
    }

    order.items.forEach( async (item) => {
        const product = await Product.findById(item.product)
        if(product){
            product.stockQuantity += item.quantity
            await product.save()
        }
    })

    const deletedOrder = await Order.findByIdAndDelete(id)

    if(!deletedOrder){
        throw new BError('Order not found',404)
    }

    res.status(200).json({
        message: 'Deleted successfully'
    })
})

module.exports = {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
}