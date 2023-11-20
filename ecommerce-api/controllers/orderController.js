const asyncHandler = require('express-async-handler')
const Address = require('../models/addressModel')
const Payment = require('../models/paymentSchema')
const Order = require('../models/orderSchema')
const Product = require('../models/productModel')
const {
    checkConsistency,
    updateProductStock,
    validateAddressAndPayment,
    validateOrderInput,
    validateProductStock
} = require('../utils/orderUtils')

// GET ALL ORDERS
const getAllOrders = asyncHandler(async (req,res) => {
    let query = {}

    // Filtering by user
    if(req.query.user){
        query.user = req.query.user
    }

    // Filtering by status
    if(req.query.status){
        query.status = req.query.status
    }

    // Filtering by date range
    if (req.query.startDate && req.query.endDate) {
        query.createdAt = {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate),
        };
    }

    // Sorting
    let sortOptions = {}

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    const orders = await Order.find(query).sort(sortOptions).populate('shippingAddress').populate("paymentDetails").populate({
        path: 'items.product',
        model: 'Product'
    })

    if(orders.length <= 0){
        res.status(300)
        throw new Error('No Orders has been made')
    }else{
        res.status(200).json({
            message: "success",
            orders
        })
    }
})

// GET Single ORDER
const getOrder = asyncHandler(async (req,res) => {
    const {id} = req.params 

    const order = await Order.findById(id).populate('shippingAddress').populate("paymentDetails").populate({
        path: 'items.product',
        model: 'Product', // Replace with the actual model name for the Product
    });

    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }

    res.status(200).json({
        message: 'success',
        order
    })
})

// Create New Order
const createOrder = asyncHandler(async (req, res) => {
    const { user, items, shippingAddress, paymentDetails } = req.body;

    try {
        validateOrderInput(user, items, shippingAddress, paymentDetails);

        const { address, payment } = await validateAddressAndPayment(shippingAddress, paymentDetails);

        // Check if userId matches the one associated with the addressId and paymentId
        const isConsistent = await checkConsistency(user, address._id, payment._id);

        if (!isConsistent) {
            throw new Error("Inconsistent user information");
        }

        await validateProductStock(items);

        const productIds = items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        const totalPrice = items.reduce((total, item) => {
            const product = products.find(p => p._id.equals(item.product));
            return total + product.price * item.quantity;
        }, 0);

        const order = await Order.create({
            user,
            items,
            shippingAddress: address._id,
            paymentDetails: payment._id,
            totalPrice
        });

        await updateProductStock(items);

        res.status(200).json({
            message: "success",
            order
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update Order
const updateOrder = asyncHandler(async (req,res) => {
    const {id} = req.params 
    const {user,status,shippingAddress,paymentDetails} = req.body

    if(!user){
        res.status(400)
        throw new Error('All fields required')
    }

    let order = await Order.findById(id)

    if(!order){
        res.status(404)
        throw new Error('Order not found')
    }

    const isValidUser = user === order.user.toString() ? true : false 

    if(!isValidUser){
        res.status(401)
        throw new Error('user doesnot match with this order')
    }

    order.status = status || order.status 
    order.shippingAddress = shippingAddress || order.shippingAddress
    order.paymentDetails = paymentDetails || order.paymentDetails
    
    await order.save()

    res.status(200).json({
        message: "success",
        order: order
    })
})

// Delete Order
const deleteOrder = asyncHandler(async (req,res) => {
    const {id} = req.params 

    const order = await Order.findById(id)

    if(!order){
        res.status(400)
        throw new Error('Order not found')
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
        res.status(404)
        throw new Error('Order not found')
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