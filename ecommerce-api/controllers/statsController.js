const asyncHandler = require('express-async-handler');
const Order = require('../models/orderSchema');


const getTotalSales = asyncHandler(async (req,res) => {
    const totalSales = await Order.aggregate([
        {
          $match: {
            status: 'delivered', // Assuming only delivered orders are considered for total sales
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' },
          },
        },
    ]);
    if (totalSales.length === 0) {
        // If there are no orders or no delivered orders, totalSales will be 0
        return res.status(200).json({
          message: 'success',
          totalSales: 0,
        });
    }

    const { totalSales: totalAmount } = totalSales[0];

    res.status(200).json({
        message: 'success',
        totalSales: totalAmount
    })
})

const getProfileLoss = asyncHandler(async (req,res) => {
    const totalSales = await Order.aggregate([
        {
          $match: {
            status: 'delivered', // Assuming only delivered orders are considered for total sales
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' },
          },
        },
      ]);
    
      // Calculate total cost of goods sold (COGS)
      const totalCOGS = await Order.aggregate([
        {
          $match: {
            status: 'delivered', // Assuming only delivered orders are considered for COGS
          },
        },
        {
          $unwind: '$items',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        {
          $unwind: '$productInfo',
        },
        {
          $group: {
            _id: null,
            totalCOGS: { $sum: { $multiply: ['$items.quantity', '$productInfo.price'] } },
          },
        },
      ]);

        
    
      if (totalSales.length === 0 || totalCOGS.length === 0) {
        // If there are no orders or no delivered orders, totalProfitLoss will be 0
        return res.status(200).json({
          message: 'success',
          totalProfitLoss: 0,
        });
      }
    
      // Extract the totalSales and totalCOGS values from the results
      const { totalSales: totalAmount } = totalSales[0];
      const { totalCOGS: totalCost } = totalCOGS[0];
    
      // Calculate total profit or loss
      const totalProfitLoss = totalAmount - totalCost;

      console.log({totalAmount,totalCost,totalProfitLoss})
    
      res.status(200).json({
        message: 'success',
        totalProfitLoss,
      });
})

const getBestSellingProduct = asyncHandler(async (req,res) => {
    const mostSoldProducts = await Order.aggregate([
        {
          $match: {
            status: 'delivered',
          },
        },
        {
          $unwind: '$items',
        },
        {
          $group: {
            _id: '$items.product',
            totalQuantitySold: { $sum: '$items.quantity' },
          },
        },
        {
          $sort: {
            totalQuantitySold: -1,
          },
        },
        {
          $limit: 5, // Adjust the limit based on how many top products you want to retrieve
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        {
          $unwind: '$productInfo',
        },
        {
          $project: {
            _id: 0,
            productId: '$_id',
            productName: '$productInfo.name',
            totalQuantitySold: 1,
          },
        },
      ]);
    
      res.status(200).json({
        message: 'success',
        mostSoldProducts,
      });
})

const getTopCategoryBySales = asyncHandler(async (req,res)=>{
    const topCategories = await Order.aggregate([
        {
          $match: {
            status: 'delivered',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        {
          $unwind: '$productInfo',
        },{
            $unwind: '$items'
        },
        {
          $group: {
            _id: '$productInfo.category',
            totalSales: { $sum: '$items.quantity' },
          },
        },
        {
            $sort: {
              totalSales: -1,
            },
        },
        {
            $limit: 5, // Adjust the limit based on how many top categories you want to retrieve
        },
        {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'categoryInfo',
            },
        },
        {
            $unwind: '$categoryInfo',
        },
        {
            $project: {
              _id: 0,
              categoryId: '$_id',
              categoryName: '$categoryInfo.name',
              totalSales: 1,
            },
        },
      
      ]);

    
      res.status(200).json({
        message: 'success',
        topCategories,
      });
})

const getCustomerLocation = asyncHandler(async (req,res) => {
    
    const customerLocations = await Order.find({status: 'delivered'}).select('shippingAddress').populate('shippingAddress')

    res.status(200).json({
        message: 'success',
        customerLocations
    })
})

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
    getBestSellingProduct,
    getCustomerLocation,
    getProfileLoss,
    getMostActiveUser,
    getTopCategoryBySales
}