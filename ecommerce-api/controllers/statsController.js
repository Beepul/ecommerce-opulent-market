const asyncHandler = require('express-async-handler')


const getTotalSales = asyncHandler(async (req,res) => {
    res.send('totalsales stats')
})
const getBestSellingProduct = asyncHandler(async (req,res) => {
    res.send('best selling product stats')
})
const getCustomerLocation = asyncHandler(async (req,res) => {
    res.send('customer-location stats')
})


module.exports = {
    getTotalSales,
    getBestSellingProduct,
    getCustomerLocation
}