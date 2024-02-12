const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'At least One product is required']
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: [true, 'Please provide total price']
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
    ref: 'Address',
    required: [true, 'Please provide shipping address'] 
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: {
        values: ['cash', 'online'],
        message: 'Payment method must be either "Cash" or "Online"',
      },
      required: [true, 'Please select one of the payment method']
    },
    paymentStatus: {
      type: String,
      default: 'due',
      enum: {
        values: ['due', 'paid'],
        message: 'Payment status must be either "due" or "paid" '
      }
    }
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
