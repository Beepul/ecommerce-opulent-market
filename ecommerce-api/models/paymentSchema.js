const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['Cash', 'Online'],
      message: 'Payment method must be either "Cash" or "Online"',
    },
    required: true
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
