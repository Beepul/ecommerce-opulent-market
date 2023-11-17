const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: "15s"})
}
const generateRefreshToken = (id) => {
    return jwt.sign({id},process.env.REFRESH_TOKEN_SECRET,{expiresIn: "30s"})
}


module.exports = {
    generateToken,
    generateRefreshToken,
}