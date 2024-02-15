require('dotenv').config()
const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./middleware/logger')
const cors = require('cors')
const connectDB = require('./config/db.connect')
const { default: mongoose } = require('mongoose')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const categoryRoute = require('./routes/categoryRoute')
const orderRoute = require('./routes/orderRoute')
const reviewRoute = require('./routes/reviewRoute')
const addressRoute = require('./routes/addressRoute')
const statsRoute = require('./routes/statsRoute')
const fileUpload = require('express-fileupload')
const cloudinary = require('./config/cloudinary')
const stripeRoute = require('./routes/stripe')
const transactionRoute = require('./routes/transitionRoute')





console.log(process.env.NODE_ENV)

const app = express()

const PORT = process.env.PORT || 3500


app.use(logger())
app.use(cors(corsOptions))

app.use('/api/v1/stripe/webhook',stripeRoute.stripeWebhookRoute)

app.use(express.urlencoded({extended: true,parameterLimit: 8000, limit: '8mb'}))
app.use(express.json({limit: '8mb'}))
app.use(cookieParser())



app.use(fileUpload({
    useTempFiles: true
}))

app.use(cloudinary)

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/orders', orderRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/address',addressRoute) 
app.use('/api/v1/admin/stats', statsRoute)
app.use('/api/v1/stripe', stripeRoute.stripeRoute)
app.use('/api/v1/transaction', transactionRoute)



app.get('/',(req,res) => {
    console.log('Seven Shop')
    res.send('Seven Shop')
})

connectDB()

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT,() => {
        console.log(`app is running on port ${PORT}`)
    })
})

mongoose.connection.on('error',err => {
    console.log("DB Error::",err)
})
