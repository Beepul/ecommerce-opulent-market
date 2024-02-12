const asyncHandler = require("express-async-handler")
const BError = require("../utils/error")
const Transaction = require("../models/transactionModel")

const getAllTransaction = asyncHandler( async (req,res) => {
    try {
        const transactions = await Transaction.find()

        res.status(200).json({
            message: 'success',
            transactions
        })
    } catch (error) {
        throw new BError(error.message || 'Error occured while getting all transaction', 400)
    }

})

module.exports = {
    getAllTransaction
}