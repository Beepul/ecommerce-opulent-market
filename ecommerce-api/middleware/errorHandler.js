const errorHandler = (err,req,res,next) => {
    // console.log(err.statusCode)
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error"

    // errorLogger(err.message)

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null 
    })
}

module.exports = errorHandler