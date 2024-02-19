const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const BError = require('../utils/error');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

const getTotalSales = asyncHandler(async (req, res) => {
	const totalSales = await Order.aggregate([
		{
			$match: {
				status: 'delivered' 
			}
		},
		{
			$group: {
				_id: null,
				totalSales: { $sum: '$totalPrice' }
			}
		}
	]);
	if (totalSales.length === 0) {
		return res.status(200).json({
			message: 'success',
			totalSales: 0
		});
	}

	const { totalSales: totalAmount } = totalSales[0];

	res.status(200).json({
		message: 'success',
		totalSales: totalAmount
	});
});

const getTotalUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find();
		res.json({
			message: 'success',
			users,
			userCount: users.length
		});
	} catch (error) {
		throw BError(error.message || 'Error While Getting All User Count', 400);
	}
});


const getProfitLoss = asyncHandler(async (req, res) => {

	const totalShippingCost = await Transaction.aggregate([
		{
			$lookup: {
				from: 'orders',
				localField: 'order',
				foreignField: '_id',
				as: 'orderDetails'
			}
		},
		{
			$unwind: '$orderDetails'
		},
		{
			$match: {
				'orderDetails.status': 'delivered',
				'orderDetails.paymentDetails.paymentStatus': 'paid'
			}
		},
		{
			$group: {
				_id: null,
				totalShippingCost: { $sum: '$shipping_cost' } 
			}
		}
	]);


	const totalShipping = totalShippingCost.length > 0 ? totalShippingCost[0].totalShippingCost : 0;


	const totalProfitLoss = totalShipping;


	res.status(200).json({
		message: 'success',
		totalProfitLoss
	});
});

const getBestSellingProduct = asyncHandler(async (req, res) => {
	const mostSoldProducts = await Order.aggregate([
		{
			$match: {
				status: 'delivered'
			}
		},
		{
			$unwind: '$items'
		},
		{
			$group: {
				_id: '$items.product',
				totalQuantitySold: { $sum: '$items.quantity' }
			}
		},
		{
			$sort: {
				totalQuantitySold: -1
			}
		},
		{
			$limit: 5 
		},
		{
			$lookup: {
				from: 'products',
				localField: '_id',
				foreignField: '_id',
				as: 'productInfo'
			}
		},
		{
			$unwind: '$productInfo'
		},
		{
			$project: {
				_id: 0,
				product: '$productInfo',
				totalQuantitySold: 1
			}
		}
	]);

	res.status(200).json({
		message: 'success',
		mostSoldProducts
	});
});

const getTopCategoryBySales = asyncHandler(async (req, res) => {
	const topCategories = await Order.aggregate([
		{
			$match: {
				status: 'delivered'
			}
		},
		{
			$lookup: {
				from: 'products',
				localField: 'items.product',
				foreignField: '_id',
				as: 'productInfo'
			}
		},
		{
			$unwind: '$productInfo'
		},
		{
			$unwind: '$items'
		},
		{
			$group: {
				_id: '$productInfo.category',
				totalSales: { $sum: '$items.quantity' }
			}
		},
		{
			$sort: {
				totalSales: -1
			}
		},
		{
			$limit: 5 // Adjust the limit based on how many top categories you want to retrieve
		},
		{
			$lookup: {
				from: 'categories',
				localField: '_id',
				foreignField: '_id',
				as: 'categoryInfo'
			}
		},
		{
			$unwind: '$categoryInfo'
		},
		{
			$project: {
				_id: '$categoryInfo._id',
				categoryName: '$categoryInfo.name',
				totalSales: 1,
				categoryImage: '$categoryInfo.image'
			}
		}
	]);

	res.status(200).json({
		message: 'success',
		topCategories
	});
});

const getCustomerLocation = asyncHandler(async (req, res) => {
	const customerLocations = await Order.find({ status: 'delivered' })
		.select('shippingAddress')
		.populate('shippingAddress');

	res.status(200).json({
		message: 'success',
		customerLocations
	});
});

const getMostActiveUser = asyncHandler(async (req, res) => {
	const mostActiveUsers = await Order.aggregate([
		{
			$match: {
				status: 'delivered'
			}
		},
		{
			$unwind: '$items'
		},
		{
			$group: {
				_id: '$user',
				totalQuantity: { $sum: '$items.quantity' }
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: '_id',
				foreignField: '_id',
				as: 'userInfo'
			}
		},
		{
			$unwind: '$userInfo'
		},
		{
			$project: {
				_id: 0,
				user: {
					_id: '$userInfo._id',
					name: '$userInfo.name',
					email: '$userInfo.email',
					role: '$userInfo.role',
					createdAt: '$userInfo.createdAt',
					updatedAt: '$userInfo.updatedAt'
				},
				totalQuantity: 1
			}
		},
		{
			$sort: {
				totalQuantity: -1 // Sort in descending order based on total quantity
			}
		}
	]);

	res.status(200).json({
		message: 'success',
		mostActiveUsers
	});
});

module.exports = {
	getTotalSales,
	getTotalUsers,
	getBestSellingProduct,
	getCustomerLocation,
	getProfitLoss,
	getMostActiveUser,
	getTopCategoryBySales
};
