const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const BError = require('../utils/error')

const validateToken = async (req,res,next) => {
    const header = req.headers.authorization || req.headers.Authorization

    
    if(!header || !header?.startsWith('Bearer ')){
        return next(new BError('Header Is Missing', 401))
    }

    const token = header.split(' ')[1]

    if(!token) {
        return next(new BError('Token Is Missing', 401))
    }

    try {
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodedToken)
        req.userId = decodedToken.id
        next()
        
    } catch (error) {
        return next(new BError(error.message || 'Error Validating Token', 401))
    }
}

const isAdmin = async (req,res,next) => {
    const userId = req.userId
    try {
       const user = await User.findById(userId).select('role') 

       if(user.role !== 'admin'){
            return res.status(403).json({
                message: 'Only admin is allowed to access this resources'
            })
       }

       next()
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {validateToken,isAdmin}