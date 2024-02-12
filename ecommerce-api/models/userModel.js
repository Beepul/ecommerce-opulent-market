const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            "Please enter a valid email"
        ]
    },
    pic: {
        type: "String",
        required: true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6,"Password must be greater than 6 characters"],
        // maxLength: [24,"Password must be less than 24 characters"],
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }

},{
    timestamps: true
})

// Encrypt password before saving to DB
// userSchema.pre("save", async function(next){

//     if(!this.isModified("password")){
//         return next()
//     }
//     // hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(this.password,salt)
//     this.password = hashedPassword
//     next()
// })

// userSchema.methods.hashPassword( async (password) => {
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password,salt)
//     return hashedPassword
// })

const User = mongoose.model('User',userSchema)
module.exports = User