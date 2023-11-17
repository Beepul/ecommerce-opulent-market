const Address = require("../models/addressModel");
const Payment = require("../models/paymentSchema");
const Product = require("../models/productModel");

const validateOrderInput = (user, items, shippingAddress, paymentDetails) => {
    if (!user || !items || items.length <= 0 || !shippingAddress || !paymentDetails) {
        throw new Error('Please provide all fields');
    }

    for (const item of items) {
        if (item.quantity <= 0) {
            throw new Error('Please increase the quantity of the product to purchase');
        }
    }
};

const validateAddressAndPayment = async (shippingAddress, paymentDetails) => {
    const address = await Address.findById(shippingAddress);
    const payment = await Payment.findById(paymentDetails);

    if (!address || !payment) {
        throw new Error('Invalid address or payment details');
    }

    return { address, payment };
};

const validateProductStock = async (items) => {
    for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product || product.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }
    }
};

const updateProductStock = async (items) => {
    for (const item of items) {
        const product = await Product.findById(item.product);
        product.stockQuantity -= item.quantity;
        await product.save();
    }
};

const checkConsistency = async (userId, addressId, paymentId) => {
    // Check if userId matches the one associated with the addressId and paymentId
    let isConsistent = false;

    if (addressId) {
        const address = await Address.findById(addressId);
        isConsistent = address && address.user.toString() === userId;
    }

    if (paymentId) {
        const payment = await Payment.findById(paymentId);
        isConsistent = payment && payment.user.toString() === userId;
    }

    return isConsistent;
};

module.exports = {
    checkConsistency,
    updateProductStock,
    validateAddressAndPayment,
    validateOrderInput,
    validateProductStock
}