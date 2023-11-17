const asyncHandler = require('express-async-handler')

const getUser = asyncHandler(async (req,res) => {
    res.send("Single User")
})

const getAllUser = asyncHandler(async (req,res) => {
    res.send("All Users")
})

const updateUser = asyncHandler(async (req,res) => {
    res.send("Update user")
})

module.exports = {
    getUser,
    getAllUser,
    updateUser
}