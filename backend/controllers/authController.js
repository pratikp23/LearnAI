import { genToken } from "../configs/token.js"
import validator from "validator"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import Otp from "../models/otpModel.js"
import sendMail, { sendMagicLinkMail, sendSignupOtpMail } from "../configs/Mail.js"



/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signUp=async (req,res)=>{
 
    try {
         console.log("signUp body:", req.body)
         let {name,email,password,role,otp}= req.body
         if (!otp) {
             return res.status(400).json({message:"OTP is required for verification"})
         }
         let otpRecord = await Otp.findOne({email})
         if (!otpRecord || otpRecord.otp !== otp) {
             return res.status(400).json({message:"Invalid or expired OTP"})
         }
         
         let existUser= await User.findOne({email})
         if(existUser){
             return res.status(400).json({message:"email already exist"})
         }
         if(!validator.isEmail(email)){
             return res.status(400).json({message:"Please enter valid Email"})
         }
         if(password.length < 8){
             return res.status(400).json({message:"Please enter a Strong Password"})
         }
         
         let hashPassword = await bcrypt.hash(password,10)
         let user = await User.create({
             name ,
             email ,
             password:hashPassword ,
             role,
             })
         
         // Clean up verified OTP
         await Otp.deleteOne({email})

         let token = await genToken(user._id)
         res.cookie("token",token,{
             httpOnly:true,
             secure:true,
             sameSite:"none",
             maxAge: 7 * 24 * 60 * 60 * 1000
         })
         return res.status(201).json(user)
 
    } catch (error) {
         console.log("signUp error:", error)
         return res.status(500).json({message:`signUp Error ${error}`})
    }
}

/**
 * @desc    Authenticate user & set session cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login=async(req,res)=>{
    try {
        let {email,password}= req.body
        let user= await User.findOne({email})
        console.log("User found:", user)
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }
        if(!user.password) {
            return res.status(400).json({message:"This account was created using Google. Please log in with Google."})
        }
        let isMatch =await bcrypt.compare(password, user.password)
         console.log("Password match:", isMatch)
        if(!isMatch){
            return res.status(400).json({message:"incorrect Password"})
        }
        let token =await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)

    } catch (error) {
        console.log("login error:", error)
        return res.status(500).json({message:`login Error ${error}`})
    }
}




export const logOut = async(req,res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        })
        return res.status(200).json({message:"logOut Successfully"})
    } catch (error) {
        return res.status(500).json({message:`logout Error ${error}`})
    }
}


export const googleSignup = async (req,res) => {
    try {
        const {name , email , role} = req.body
        let user= await User.findOne({email})
        if(!user){
            user = await User.create({
            name , email ,role
        })
        }
        let token =await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)


    } catch (error) {
        console.log(error)
         return res.status(500).json({message:`googleSignup  ${error}`})
    }
    
}

export const sendOtp = async (req,res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp=otp,
        user.otpExpires=Date.now() + 5*60*1000,
        user.isOtpVerifed= false 

        await user.save()
        await sendMail(email,otp)
        return res.status(200).json({message:"Email Successfully send"})
    } catch (error) {

        return res.status(500).json({message:`send otp error ${error}`})
        
    }
}

export const verifyOtp = async (req,res) => {
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now() ){
            return res.status(400).json({message:"Invalid OTP"})
        }
        user.isOtpVerifed=true
        user.resetOtp=undefined
        user.otpExpires=undefined
        await user.save()
        return res.status(200).json({message:"OTP varified "})


    } catch (error) {
         return res.status(500).json({message:`Varify otp error ${error}`})
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {email ,password } =  req.body
         const user = await User.findOne({email})
        if(!user || !user.isOtpVerifed ){
            return res.status(404).json({message:"OTP verfication required"})
        }

        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword
        user.isOtpVerifed=false
        await user.save()
        return res.status(200).json({message:"Password Reset Successfully"})
    } catch (error) {
        return res.status(500).json({message:`Reset Password error ${error}`})
    }
}

export const sendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" })
        }
        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "email already exist" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        )
        
        await sendSignupOtpMail(email, otp)  // Use signup-specific email subject
        return res.status(200).json({ message: "Verification OTP sent successfully" })
    } catch (error) {
        console.log("sendSignupOtp error:", error)
        return res.status(500).json({ message: `sendSignupOtp Error ${error}` })
    }
}

export const sendMagicLink = async (req, res) => {
    try {
        const { email } = req.body
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        
        const magicToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" })
        
        let frontendOrigin = "https://learning-management-system-nine-bay.vercel.app"
        const referer = req.headers.referer || req.headers.origin
        if (referer) {
            try {
                const urlObj = new URL(referer)
                frontendOrigin = `${urlObj.protocol}//${urlObj.host}`
            } catch (e) {
                console.log("Error parsing referer:", e)
            }
        }
        
        const magicLink = `${frontendOrigin}/login-magic?token=${magicToken}`
        
        await sendMagicLinkMail(email, magicLink)
        return res.status(200).json({ message: "Magic link sent to your email" })
    } catch (error) {
        console.log("sendMagicLink error:", error)
        return res.status(500).json({ message: `sendMagicLink Error ${error}` })
    }
}

export const loginMagic = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded || !decoded.userId) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }
        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        
        const authToken = await genToken(user._id)
        res.cookie("token", authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)
    } catch (error) {
        console.log("loginMagic error:", error)
        return res.status(500).json({ message: `loginMagic Error ${error}` })
    }
}