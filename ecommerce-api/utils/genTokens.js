const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: "5m"})
}
const generateRefreshToken = (id) => {
    return jwt.sign({id},process.env.REFRESH_TOKEN_SECRET,{expiresIn: "30m"})
}

const generateActivationToken = (userData) => {
    return jwt.sign({user: userData},process.env.ACTIVATION_TOEKN_SECRET,{expiresIn: "5m"})
}


module.exports = {
    generateToken,
    generateRefreshToken,
    generateActivationToken
}