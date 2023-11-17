const User = require("../models/userModel")
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const { generateToken, generateRefreshToken } = require("../utils/genTokens")

const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body 
    if(!name || !email || !password){
        res.status(400)
        throw new Error("All feilds required")
    }
    if(password.length < 6){
        res.status(400)
        throw new Error("Password must be upto 6 characters")
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(409)
        throw new Error("Email is already in use")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        res.status(201).json({
            message: "User has been created, Please login"
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})
const registerAdmin = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body 
    if(!name || !email || !password){
        res.status(400)
        throw new Error("All feilds required")
    }
    if(password.length < 6){
        res.status(400)
        throw new Error("Password must be upto 6 characters")
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(409)
        throw new Error("Email is already in use")
    }

    const user = await User.create({
        name,
        email,
        password,
        role:"admin"
    })

    if(user){
        res.status(201).json({
            message: "User has been created, Please login"
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})
const login = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("All fields required")
    }
    if(!password.length > 6){
        res.status(400)
        throw new Error("Password must be upto 6 characters")
    }
    const user = await User.findOne({email})

    if(!user){
        res.status(400)
        throw new Error("User not found")
    }

    const match = await bcrypt.compare(password,user.password)
    if(!match){
        res.status(400)
        throw new Error("email or password is incorrect")
    }
    const accessToken = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.cookie('jwt',refreshToken,{
        httpOnly: true,
        secure: true,
        same:'None',
        maxAge: 30 * 1000 // 30s
    })

    res.status(200).json({
        accessToken
    })
})
const logout = asyncHandler(async (req,res) => {
    const cookie = req.cookies
    if(!cookie?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
    res.json({message: 'Cookie cleared'})
})

module.exports = {
    registerUser,
    registerAdmin,
    login,
    logout
}