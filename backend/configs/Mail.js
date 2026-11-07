import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


// Used for: Password Reset OTP
export const sendMail = async (to, otp) => {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Reset Your Password - OTP",
        html: `<p>Your OTP for <b>Password Reset</b> is <b>${otp}</b>.
        It expires in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>`
    })
}

// Used for: Signup Email Verification OTP
export const sendSignupOtpMail = async (to, otp) => {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Verify Your Email - OTP",
        html: `<p>Welcome! Your OTP for <b>Email Verification</b> is <b>${otp}</b>.
        It expires in 5 minutes.</p>
        <p>If you did not sign up, please ignore this email.</p>`
    })
}

export const sendMagicLinkMail = async (to, magicLink) => {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Your Magic Login Link",
        html: `<p>Click the link below to instantly log in to your account. This link will expire in 15 minutes:</p>
               <p><a href="${magicLink}" style="padding: 10px 20px; background-color: black; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Login Instantly</a></p>
               <p>If the button doesn't work, copy and paste this link into your browser:</p>
               <p>${magicLink}</p>`
    })
}

export default sendMail
