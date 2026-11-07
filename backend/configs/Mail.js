import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const emailUser = process.env.EMAIL?.trim()
const emailPass = process.env.EMAIL_PASS?.trim()

if (!emailUser || emailUser.includes("add your email") || !emailPass || emailPass.includes("add your email")) {
  console.warn("⚠️ [MAIL SERVICE WARNING] EMAIL or EMAIL_PASS environment variables are not configured with a valid Gmail App Password. Outgoing OTP emails will fail until valid credentials are provided.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const senderAddress = `"LearnAI LMS" <${emailUser || "support@learnai.com"}>`

// Used for: Password Reset OTP
export const sendMail = async (to, otp) => {
    return transporter.sendMail({
        from: senderAddress,
        to: to,
        subject: "Password Reset Verification Code - LearnAI",
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #eeeeee;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #5B21B6; font-size: 24px; font-weight: 800; margin: 0;">LearnAI</h1>
                <p style="color: #666666; font-size: 14px; margin-top: 6px;">Password Reset Request</p>
            </div>
            <div style="background: #FAFAFC; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; border: 1px solid #EEEEF2;">
                <p style="color: #444444; font-size: 14px; margin: 0 0 16px 0;">Use the following 4-digit code to reset your password:</p>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #5B21B6; background: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; border: 2px dashed #5B21B6;">
                    ${otp}
                </div>
                <p style="color: #888888; font-size: 12px; margin-top: 16px; margin-bottom: 0;">This code will expire in <strong>5 minutes</strong>.</p>
            </div>
            <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                If you did not request a password reset, please disregard this email or secure your account.
            </p>
        </div>`
    })
}

// Used for: Signup Email Verification OTP
export const sendSignupOtpMail = async (to, otp) => {
    return transporter.sendMail({
        from: senderAddress,
        to: to,
        subject: "Verify Your Email - LearnAI",
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #eeeeee;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #5B21B6; font-size: 24px; font-weight: 800; margin: 0;">LearnAI</h1>
                <p style="color: #666666; font-size: 14px; margin-top: 6px;">Email Verification</p>
            </div>
            <div style="background: #FAFAFC; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; border: 1px solid #EEEEF2;">
                <p style="color: #444444; font-size: 14px; margin: 0 0 16px 0;">Welcome to LearnAI! Use this verification code to complete your registration:</p>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #5B21B6; background: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; border: 2px dashed #5B21B6;">
                    ${otp}
                </div>
                <p style="color: #888888; font-size: 12px; margin-top: 16px; margin-bottom: 0;">This code is valid for <strong>5 minutes</strong>.</p>
            </div>
            <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                If you did not attempt to sign up for LearnAI, you can safely ignore this message.
            </p>
        </div>`
    })
}

export const sendMagicLinkMail = async (to, magicLink) => {
    return transporter.sendMail({
        from: senderAddress,
        to: to,
        subject: "Your Magic Sign-In Link - LearnAI",
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 16px; border: 1px solid #eeeeee;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #5B21B6; font-size: 24px; font-weight: 800; margin: 0;">LearnAI</h1>
                <p style="color: #666666; font-size: 14px; margin-top: 6px;">Instant Passwordless Sign-In</p>
            </div>
            <div style="background: #FAFAFC; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; border: 1px solid #EEEEF2;">
                <p style="color: #444444; font-size: 14px; margin: 0 0 20px 0;">Click the button below to log into your LearnAI account instantly:</p>
                <a href="${magicLink}" style="padding: 14px 28px; background-color: #5B21B6; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(91,33,182,0.25);">
                    Log In to LearnAI
                </a>
                <p style="color: #888888; font-size: 12px; margin-top: 20px; margin-bottom: 0;">This link is valid for <strong>15 minutes</strong>.</p>
            </div>
            <p style="color: #999999; font-size: 11px; line-height: 1.5; margin: 0; text-align: center; word-break: break-all;">
                Or copy and paste this link in your browser:<br/>
                <a href="${magicLink}" style="color: #5B21B6;">${magicLink}</a>
            </p>
        </div>`
    })
}

export default sendMail
