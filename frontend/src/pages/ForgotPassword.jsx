import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'

function ForgotPassword() {
    let navigate = useNavigate()
    const [step,setStep] = useState(1)
    const [email,setEmail] = useState("")
    const [otp,setOtp] = useState("")
    const [loading,setLoading]= useState(false)
    const [newpassword,setNewPassword]= useState("")
    const [conPassword,setConpassword]= useState("")

   const handleStep1 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/sendotp` , {email} , {withCredentials:true})
      console.log(result)
      setStep(2)
      toast.success(result.data.message)
      setLoading(false)
      
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message || "Failed to send OTP")
      setLoading(false)
    }
   }

    const handleStep2 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verifyotp` , {email,otp} , {withCredentials:true})
      console.log(result)
      toast.success(result.data.message)
      setLoading(false)
      setStep(3)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message || "Failed to verify OTP")
      setLoading(false)
    }
   }

    const handleStep3 = async () => {
    setLoading(true)
    try {
      if(newpassword !== conPassword){
        setLoading(false)
        return toast.error("password does not match")
      }
      const result = await axios.post(`${serverUrl}/api/auth/resetpassword` , {email,password:newpassword} , {withCredentials:true})
      console.log(result)
      toast.success(result.data.message)
      setLoading(false)
      navigate("/login")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message || "Failed to reset password")
      setLoading(false)
    }
   }

   const handleSendMagicLink = async () => {
       if (!email) {
           return toast.error("Please enter your email first");
       }
       setLoading(true);
       try {
           const res = await axios.post(`${serverUrl}/api/auth/send-magic-link`, { email });
           toast.success(res.data.message || "Magic Link sent! Please check your email inbox.");
       } catch (err) {
           toast.error(err?.response?.data?.message || err.message || "Failed to send Magic Link");
       } finally {
           setLoading(false);
       }
   };

  return (
     <div className="min-h-screen flex items-center justify-center p-4 font-['Outfit']">
     { step==1 && <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-[var(--glass-border)] animate-slide-up">
        <h2 className="text-2xl font-extrabold mb-2 text-center text-[var(--dark-brown)]">
          Forgot Your Password?
        </h2>
        <p className="text-xs text-[var(--accent-color)] text-center font-semibold mb-6">
          Enter your email to receive a recovery code
        </p>

          <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--dark-brown)] uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2.5 border border-[var(--glass-border)] rounded-xl shadow-sm focus:outline-none focus:border-[var(--neon-blue)] text-[#1a1a1a] font-medium"
                placeholder="you@example.com"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3E5F44] hover:bg-[#2e4733] text-white py-3 px-4 rounded-xl font-bold cursor-pointer transition-all shadow-md" disabled={loading} onClick={handleStep1}
            >
              {loading?<ClipLoader size={20} color='white'/>:"Send Verification OTP"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-[var(--glass-border)]"></div>
            <span className="mx-4 text-gray-400 text-xs font-bold">OR</span>
            <div className="flex-grow border-t border-[var(--glass-border)]"></div>
          </div>

          <button
            type="button"
            className="w-full border-2 border-[var(--neon-blue)] hover:bg-[#5F8D4E]/10 text-[var(--deep-green)] py-2.5 px-4 rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2 transition-all shadow-sm"
            disabled={loading}
            onClick={handleSendMagicLink}
          >
            {loading ? <ClipLoader size={20} color="green" /> : "Email Me a Magic Login Link"}
          </button>

        <div className="text-sm text-center mt-5 text-[var(--deep-green)] font-bold cursor-pointer hover:underline" onClick={()=>navigate("/login")} >
            ← Back to Login
        </div>
      </div>}

      {step==2 && <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-[var(--glass-border)] animate-slide-up">
        <h2 className="text-2xl font-extrabold text-center text-[var(--dark-brown)] mb-2">
          Enter OTP
        </h2>
        <p className="text-xs text-[var(--accent-color)] text-center font-semibold mb-6">
          Please enter the 4-digit code sent to your email
        </p>

          <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
            <div className="flex flex-col gap-1.5 text-center">
              <input
                type="text"
                className="w-full h-12 text-center text-2xl font-bold tracking-[0.3em] border-2 border-[var(--neon-blue)] rounded-xl outline-none text-[#1a1a1a]"
                placeholder="1234"
                maxLength={4}
                onChange={(e)=>setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3E5F44] hover:bg-[#2e4733] text-white py-3 px-4 rounded-xl font-bold cursor-pointer transition-all shadow-md" disabled={loading} onClick={handleStep2} 
            >
              {loading?<ClipLoader size={20} color='white'/>:"Verify OTP"}
            </button>
          </form>

        <div className="text-sm text-center mt-5 text-[var(--deep-green)] font-bold cursor-pointer hover:underline" onClick={()=>navigate("/login")} >
            ← Back to Login
        </div>
      </div>}

      {step==3 && <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-[var(--glass-border)] animate-slide-up">
        <h2 className="text-2xl font-extrabold text-center text-[var(--dark-brown)] mb-2">
          Reset Your Password
        </h2>
        <p className="text-xs text-[var(--accent-color)] text-center font-semibold mb-6">
          Enter a new password below to regain access to your account
        </p>

        <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--dark-brown)] uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 border border-[var(--glass-border)] rounded-xl focus:border-[var(--neon-blue)] focus:outline-none text-[#1a1a1a] font-medium" onChange={(e)=>setNewPassword(e.target.value)}
              value={newpassword}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--dark-brown)] uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 border border-[var(--glass-border)] rounded-xl focus:border-[var(--neon-blue)] focus:outline-none text-[#1a1a1a] font-medium" onChange={(e)=>setConpassword(e.target.value)}
              value={conPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3E5F44] hover:bg-[#2e4733] text-white py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer" onClick={handleStep3}
          >
            {loading?<ClipLoader size={20} color='white'/>:"Reset Password"}
          </button>
        </form>

        <div className="text-center text-sm mt-5 text-[var(--deep-green)] font-bold cursor-pointer hover:underline" onClick={()=>navigate("/login")}>
            ← Back to Login
        </div>
      </div>}
    </div>
  )
}

export default ForgotPassword
