const Transaction = require("../models/transactionModel");

const createTransaction = asyncHandler(async (req, res) => {
    const { amount, type, order } = req.body;

    // Validate the request body
    if (!amount || !type || !order) {
        res.status(400);
        throw new Error('Please provide amount, type, and order ID');
    }

    // Create the transaction
    const transaction = await Transaction.create({
        amount,
        type,
        order,
    });

    res.status(201).json({
        message: 'Transaction created successfully',
        transaction,
    });
});

const getAllTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find();

    res.status(200).json({
        message: 'Success',
        transactions,
    });
});


const getTransactionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    res.status(200).json({
        message: 'Success',
        transaction,
    });
});

const updateTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, type } = req.body;

    // Validate the request body
    if (!amount && !type) {
        res.status(400);
        throw new Error('Please provide amount or type for update');
    }

    let transaction = await Transaction.findById(id)

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    transaction.amount = amount || transaction.amount
    transaction.type = type || transaction.type 

    await transaction.save()

    res.status(200).json({
        message: 'Transaction updated successfully',
        transaction,
    });
});


module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction
}