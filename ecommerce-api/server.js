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
const userRoute = require('./routes/userRoute')
const addressRoute = require('./routes/addressRoute')
const paymentRoute = require('./routes/paymentRoute')
const statsRoute = require('./routes/statsRoute')





console.log(process.env.NODE_ENV)

const app = express()

const PORT = process.env.PORT || 3500


app.use(logger())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/orders', orderRoute)
app.use('/api/products', reviewRoute)
app.use('/api/user',userRoute)
app.use('/api/user',addressRoute)
app.use('/api/user',paymentRoute)
app.use('/api/admin/stats', statsRoute)



app.get('/api/test',(req,res) => {
    res.send('Hello')
})

app.use(errorHandler)

connectDB()

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT,() => {
        console.log(`app is running on port ${PORT}`)
    })
})

mongoose.connection.on('error',err => {
    console.log(err)
})
