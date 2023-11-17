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
    res.send("All orders")
})

// GET Single ORDER
const getOrder = asyncHandler(async (req,res) => {
    res.send("Single order")
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
    res.send("Update order")
})

// Delete Order
const deleteOrder = asyncHandler(async (req,res) => {
    res.send("Delete order")
})

module.exports = {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
}