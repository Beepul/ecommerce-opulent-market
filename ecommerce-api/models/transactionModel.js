const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: [true, 'User is required'] 
    },
    order : {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'Order',
        required: [true, 'Order is required'] 
    },
    amount_subtotal: {
        type: Number,
    },
    shipping_cost: {
        type: Number
    },
    amount: {
        type: Number, 
        required: [true, 'Please enter the amount']
    },
    payment_status: {
        type: String
    },
    paidAt: {
        type: Date,
    },
},{
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction