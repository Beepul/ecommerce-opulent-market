const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered'],
      message: 'Please provide a valid status'
    },
    default: 'pending'
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  paymentDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
