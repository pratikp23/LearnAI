import express from "express"
import { 
  googleSignup,
  login,
  logOut,
  resetPassword,
  sendOtp,
  signUp,
  verifyOtp,
  sendSignupOtp,
  sendMagicLink,
  loginMagic
} from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)

authRouter.post("/login", login)

authRouter.get("/logout", logOut)

authRouter.post("/googlesignup", googleSignup)

authRouter.post("/sendotp", sendOtp)

authRouter.post("/verifyotp", verifyOtp)

authRouter.post("/resetpassword", resetPassword)

authRouter.post("/send-signup-otp", sendSignupOtp)

authRouter.post("/send-magic-link", sendMagicLink)

authRouter.post("/login-magic", loginMagic)

export default authRouter





