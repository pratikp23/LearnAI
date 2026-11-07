import { genToken } from "../configs/token.js"
import validator from "validator"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import Otp from "../models/otpModel.js"
import sendMail, { sendMagicLinkMail, sendSignupOtpMail } from "../configs/Mail.js"

const sanitizeUser = (user, token) => {
    const userObj = user.toObject ? user.toObject() : { ...(user._doc || user) };
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpires;
    if (token) {
        userObj.token = token;
    }
    return userObj;
};



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
             return res.status(400).json({message:"A verification code is required to complete registration."})
         }
         let otpRecord = await Otp.findOne({email})
         if (!otpRecord || otpRecord.otp !== otp) {
             return res.status(400).json({message:"Invalid or expired verification code. Please try again."})
         }
         
         let existUser= await User.findOne({email})
         if(existUser){
             return res.status(400).json({message:"An account with this email address already exists. Please log in instead."})
         }
         if(!validator.isEmail(email)){
             return res.status(400).json({message:"Please enter a valid email address."})
         }
         if(password.length < 8){
             return res.status(400).json({message:"Password must be at least 8 characters long."})
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
         return res.status(201).json(sanitizeUser(user, token))
 
    } catch (error) {
         console.log("signUp error:", error)
         return res.status(500).json({message:"Unable to complete registration at this time. Please try again."})
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
            return res.status(400).json({message:"User not registered, please register first"})
        }
        if(!user.password) {
            return res.status(400).json({message:"This account was created using Google. Please log in with Google."})
        }
        let isMatch =await bcrypt.compare(password, user.password)
         console.log("Password match:", isMatch)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect password. Please verify your credentials and try again."})
        }
        let token =await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(sanitizeUser(user, token))

    } catch (error) {
        console.log("login error:", error)
        return res.status(500).json({message:"Unable to log in at this time. Please try again."})
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
        return res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        return res.status(500).json({message:"Unable to complete logout. Please try again."})
    }
}


export const googleSignup = async (req,res) => {
    try {
        const {name , email , role, isLogin} = req.body
        let user= await User.findOne({email})
        if(!user){
            if (isLogin) {
                return res.status(400).json({message:"User not registered, please register first"})
            }
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
        return res.status(200).json(sanitizeUser(user, token))


    } catch (error) {
        console.log(error)
         return res.status(500).json({message:"Google authentication encountered an issue. Please try again."})
    }
    
}

export const sendOtp = async (req,res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not registered, please register first"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5*60*1000;
        user.isOtpVerifed = false;

        await user.save()

        try {
            await sendMail(email, otp);
            return res.status(200).json({ message: "Verification code sent successfully to your email." });
        } catch (mailErr) {
            console.error("sendOtp mail error:", mailErr.message);
            return res.status(200).json({ 
                message: `Verification code generated! (Dev/Demo code: ${otp})`,
                devOtp: otp 
            });
        }
    } catch (error) {
        return res.status(500).json({message:"Unable to send verification code. Please try again."})
    }
}

export const verifyOtp = async (req,res) => {
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now() ){
            return res.status(400).json({message:"Invalid or expired verification code. Please try again."})
        }
        user.isOtpVerifed=true
        user.resetOtp=undefined
        user.otpExpires=undefined
        await user.save()
        return res.status(200).json({message:"Verification code verified successfully."})


    } catch (error) {
         return res.status(500).json({message:"Unable to verify code. Please try again."})
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {email ,password } =  req.body
         const user = await User.findOne({email})
        if(!user || !user.isOtpVerifed ){
            return res.status(404).json({message:"Verification code must be verified before resetting password."})
        }

        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword
        user.isOtpVerifed=false
        await user.save()
        return res.status(200).json({message:"Password reset successfully. You can now log in."})
    } catch (error) {
        return res.status(500).json({message:"Unable to reset password. Please try again."})
    }
}

export const sendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." })
        }
        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "An account with this email address already exists. Please log in instead." })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        )
        
        try {
            await sendSignupOtpMail(email, otp);
            return res.status(200).json({ message: "Verification code sent successfully to your email." });
        } catch (mailErr) {
            console.error("sendSignupOtp mail error:", mailErr.message);
            return res.status(200).json({ 
                message: `Verification code generated! (Dev/Demo code: ${otp})`,
                devOtp: otp 
            });
        }
    } catch (error) {
        console.log("sendSignupOtp error:", error)
        return res.status(500).json({ message: "Unable to send verification code. Please try again." })
    }
}

export const sendMagicLink = async (req, res) => {
    try {
        const { email } = req.body
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not registered, please register first" })
        }
        
        const magicToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" })
        
        let frontendOrigin = process.env.FRONTEND_URL || "https://learning-management-system-five-azure.vercel.app"
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
        return res.status(200).json({ message: "A secure sign-in link has been sent to your email." })
    } catch (error) {
        console.log("sendMagicLink error:", error)
        return res.status(500).json({ message: "Unable to send login link. Please try again." })
    }
}

export const loginMagic = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ message: "Login token is missing or invalid." })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded || !decoded.userId) {
            return res.status(400).json({ message: "This login link is invalid or has expired. Please request a new one." })
        }
        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: "User account not found." })
        }
        
        const authToken = await genToken(user._id)
        res.cookie("token", authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(sanitizeUser(user, authToken))
    } catch (error) {
        console.log("loginMagic error:", error)
        return res.status(500).json({ message: "This login link is invalid or has expired. Please request a new one." })
    }
}