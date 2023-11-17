const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['sale', 'refund'],
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
