const User = require("../models/userModel")
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const { generateToken, generateRefreshToken, generateActivationToken } = require("../utils/genTokens")
const jwt = require('jsonwebtoken')
const { sendEmail } = require("../utils/mailer")
const { hashPassword } = require("../utils/hashPassword")
const BError = require("../utils/error")
const { OAuth2Client } = require('google-auth-library')
const generateRandomPassword = require("../utils/randomPasswordGenerator")

const signUp = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body 
    if(!name || !email || !password){
        throw new BError("All feilds required",400)
    }
    if(password.length < 6){
        throw new BError("Password must be upto 6 characters",400)
    }

    const userExists = await User.findOne({email})

    if(userExists){
        throw new BError("Email is already in use",409)
    }

    const newPassowrd = await hashPassword(password)


    const activationToken = generateActivationToken({name,email,password: newPassowrd})

    const activationUrl = `${process.env.CLIENT_URL}/activation/${activationToken}`

    sendEmail({
        email,
        subject: 'Account Activation',
        message: `
            <h2>Hello ${name}</h2>
            <p>To activate your account click the link below</p>
            <p>Link is only valid for 5 minutes</p>
            <a href=${activationUrl} clicktracking=off>${activationUrl}</a>
        `
    })
    
    res.status(200).json({
        success: true,
        message: 'User Activation link send',
    })
})

const activateUser = asyncHandler(async (req,res) => {
    try {
        const {token} = req.params

        const decodedToken = jwt.verify(token,process.env.ACTIVATION_TOEKN_SECRET)

        if(!decodedToken || !decodedToken.user){
            throw new BError('Forbiden',403)
        }
        const {name,email,password} = decodedToken.user
        
        if(!name || !email || !password){
            throw new BError('Invalid token, please try again',400)
        }
        const userExists = await User.findOne({email})
        if(userExists){
            throw new BError("Email is already in use",409)
        }
        await User.create({
            name,
            email,
            password
        })
        res.status(201).json({
            message: "User has been created, Please login"
        })
    } catch (error) {
        throw new BError(error.message || 'Please provide valid data',403)
    }
})


const login = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        throw new BError("All fields required",400)
    }
    if(!password.length > 6){
        throw new BError("Password must be upto 6 characters",400)
    }
    const user = await User.findOne({email})

    if(!user){
        throw new BError("User not found",404)
    }

    const match = await bcrypt.compare(password,user.password)
    if(!match){
        throw new BError("email or password is incorrect",400)
    }
    const accessToken = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.cookie('ecommerceToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 60 * 60 * 1000 // 30 minutes
        // maxAge: 30 * 1000 // 5 minutes
        // maxAge: 5 * 60 * 1000 // 5 minutes
    });
    

    res.status(200).json({
        message: 'success',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken
        }
    })
})

const getRefreshToken = asyncHandler(async (req,res) => {

    const cookie = req.cookies

    if(!cookie){
        throw new BError('Please Login To Continue', 403)
    }


    const refreshToken = cookie.ecommerceToken 

    if(!refreshToken){
        throw new BError('Please Login To Proceed Further', 403)
    }

    try {
        const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken.id)
    
        if(!user){
            throw new BError('Unauthorized', 403)
        }
    
        const accessToken = generateToken(user._id)
    
        
        res.status(200).json({
            message: 'success',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken
            }
        })
        
    } catch (error) {
        throw new BError(error.message || 'JWT Token Error', 403)
    }

})

const logout = asyncHandler(async (req,res) => {
    const cookie = req.cookies
    if(!cookie?.ecommerceToken) return res.sendStatus(204)
    res.clearCookie('ecommerceToken',{httpOnly:true,sameSite:'None',secure:true})
    res.json({message: 'Cookie cleared'})
})


const registerAdmin = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body 
    if(!name || !email || !password){
        throw new BError("All feilds required",400)
    }
    if(password.length < 6){
        throw new BError("Password must be upto 6 characters",400)
    }

    const userExists = await User.findOne({email})

    if(userExists){
        throw new BError("Email is already in use",409)
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
        throw new BError("Invalid user data",400)
    }
})

const autoLogin = asyncHandler(async (req,res) => {
    let cookie = req.cookies
    
    if(cookie){
        cookie = cookie.ecommerceToken
    }

    if(!cookie){
        throw new BError('Forbidden', 403)
    }

    try {
        const decodedToken = jwt.verify(cookie, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken.id).select('-password')
        const accessToken = generateToken(user._id)
        
        res.status(200).json({
            message: 'success',
            user: {...user._doc,accessToken}
        })
    } catch (error) {
        throw new BError('Forbiden', 403)
    }

})

const updateUser = asyncHandler(async (req,res) => {
    try {
        const {name} = req.body

        if(!name){
            throw new BError('All Fields Required', 400)
        }

        const id = req.userId 

        const user = await User.findByIdAndUpdate(id,{name},{new: true}).select('-password')

      
        res.status(200).json({
            message: 'success',
            user
        })

    } catch (error) {
        throw new BError(error.message || 'Cannot update user credentials', 400)
    }
})

const updatePassword = asyncHandler(async (req,res) => {
    try {
        const {password,newPassword} = req.body
 
        if(!password || !newPassword){
            throw new BError('Both password required', 400)
        }
        const id = req.userId
        const user = await User.findById(id)

        const isValidPassword = await bcrypt.compare(password, user.password)


        if(!isValidPassword){
            throw new BError('Old Password is incorrect', 400)
        }

        const hashedPassword = await hashPassword(newPassword)

        const updatedUser = await User.findByIdAndUpdate(id,{passowrd: hashedPassword}).select('-password')

    
        res.status(200).json({
            message: 'success',
            user: updatedUser
        })


    } catch (error) {
        throw new BError(error.message || 'Cannot update password', 400)
    }
})

const passwordRestLink = asyncHandler(async (req,res) => {
    try {
        const {email} = req.body 
        
        const user = await User.findOne({email})

        if(!user){
            throw new BError('User Not Found', 404)
        }

        const resetToken = generateActivationToken({id:user._id})

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

        sendEmail({
            email,
            subject: 'Password Reset',
            message: `
                <h2>Hello ${user.name}</h2>
                <p>To reset your password click the link below</p>
                <p>Link is only valid for 5 minutes</p>
                <a href=${resetUrl} clicktracking=off>Click Here!</a>
            `
        })

        res.status(200).json({
            message: 'success'
        })

    } catch (error) {
        throw new BError(error.message || 'Cannot send rest link', 400)
    }
})

const resetPassword = asyncHandler(async (req,res) => {
    try {
        const {token, password} = req.body 
    

        if(!token){
            throw new BError('Cannot process without reset token, Please check your mail for token', 400)
        }

        if(!password){
            throw new BError('Password is required!', 400)
        }
        const decodedToken = jwt.verify(token,process.env.ACTIVATION_TOEKN_SECRET)
        
        const id = decodedToken.user.id 
        

        const user = await User.findById(id)

        const hashedPassword = await hashPassword(password)

        user.passowrd = hashedPassword

        await user.save()

        res.status(200).json({
            message: 'Success'
        })
    } catch (error) {
        throw new BError(error.message || 'Failed to reset password', 400)
    }
})


const authClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleLogin = asyncHandler((req,res) => {
    const {credential,clientId} = req.body

    if(credential){
        authClient.verifyIdToken({idToken: credential, audience: clientId})
            .then(async (response) => {
                const {email_verified,email,name,picture} = response.payload
                if(email_verified){
                    try {
                        const user = await User.findOne({email}).exec()

                        if(user){
                            const {password,...rest} = user._doc
                            const accessToken = generateToken(user._id)
                            const refreshToken = generateRefreshToken(user._id)

                            res.cookie('ecommerceToken', refreshToken, {
                                httpOnly: true,
                                secure: true,
                                sameSite: 'None',
                                maxAge: 60 * 60 * 1000 // 30 minutes
                                // maxAge: 30 * 1000 // 5 minutes
                                // maxAge: 5 * 60 * 1000 // 5 minutes
                            });
                            res.status(200).json({
                                message: 'login success',
                                user: {...rest,accessToken}
                            })
                        }else{
                            const randomPassword = generateRandomPassword(12);
                            const newPassowrd = await hashPassword(randomPassword)
                            const newUser = await User.create({name,email,password: newPassowrd,pic: picture})

                            const {password,...rest} = newUser._doc

                            const accessToken = generateToken(newUser._id)
                            const refreshToken = generateRefreshToken(newUser._id)

                            // console.log('Sending email ...')
                            
                            // sendEmail({
                            //     email,
                            //     subject: 'Seven Shop Password',
                            //     message: `
                            //         <h2>Hello ${name}</h2>
                            //         <p>Your current password is set as:</p>
                            //         <h3>${newPassowrd}</h3><br><br>
                            //         <p>Please feel free to change your password.</p>
                            //     `
                            // })

                            // console.log('After email sending!')

                            res.cookie('ecommerceToken', refreshToken, {
                                httpOnly: true,
                                secure: true,
                                sameSite: 'None',
                                maxAge: 60 * 60 * 1000 // 30 minutes
                                // maxAge: 30 * 1000 // 5 minutes
                                // maxAge: 5 * 60 * 1000 // 5 minutes
                            });
                            res.status(200).json({
                                message: 'signup success',
                                user: {...rest,accessToken}
                            })
                        }
                    } catch (error) {
                        throw new BError(error.message || 'Failed to login', 400)
                    }
                }
            })
            .catch(err =>  {
                throw new BError(err.message || 'Failed to login, Please contact owner', 400)
            })
    }
})


module.exports = {
    signUp,
    activateUser,
    registerAdmin,
    login,
    getRefreshToken,
    logout,
    autoLogin,
    updateUser,
    updatePassword,
    passwordRestLink,
    resetPassword,
    googleLogin
}