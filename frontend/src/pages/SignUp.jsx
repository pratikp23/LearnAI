import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from "../assets/google.png";
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/Firebase'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
    const [name,setName]= useState("")
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [role,setRole]= useState("student")
    const [step, setStep] = useState(1)
    const [otp, setOtp] = useState("")
    const navigate = useNavigate()
    let [show,setShow] = useState(false)
    const [loading,setLoading]= useState(false)
    let dispatch = useDispatch()

    const handleSignUp = async () => {
        if (!name || !email || !password || !role) {
            return toast.error("Please fill in all details");
        }
        setLoading(true)
        try {
            if (step === 1) {
                const result = await axios.post(serverUrl + "/api/auth/send-signup-otp" , { email } , {withCredentials:true} )
                toast.success(result.data.message || "OTP sent successfully")
                setStep(2)
            } else {
                if (!otp) {
                    toast.error("Please enter the OTP sent to your email");
                    return;
                }
                const result = await axios.post(serverUrl + "/api/auth/signup" , {name , email , password , role, otp} , {withCredentials:true} )
                dispatch(setUserData(result.data))
                navigate("/")
                toast.success("SignUp Successfully")
            }
        } 
        catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message || "SignUp failed")
        } finally {
            setLoading(false)
        }
    }

    const googleSignUp = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let user = response.user
            let name = user.displayName;
            let email = user.email
            
            const result = await axios.post(serverUrl + "/api/auth/googlesignup" , {name , email ,role}
                , {withCredentials:true}
            )
            dispatch(setUserData(result.data))
            navigate("/")
            toast.success("SignUp Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message || "Google signup failed")
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAFAFC]">
            <form className="w-[95%] md:w-[840px] min-h-[580px] bg-white shadow-[0_12px_45px_rgba(91,33,182,0.08)] rounded-3xl flex overflow-hidden border border-[#EEEEF2] animate-slide-up" onSubmit={(e)=>e.preventDefault()}>
                <div className="md:w-[55%] w-full flex flex-col items-center justify-center p-8 md:p-12 gap-4">
                    <div className="text-center md:text-left w-[85%]">
                        <h1 className="font-black text-[#171717] text-3xl">Let's Get Started</h1>
                        <h2 className="text-[#666666] text-sm font-medium mt-1">{step === 1 ? "Create your account" : "Verify your email"}</h2>
                    </div>

                    {step === 1 ? (
                        <>
                            <div className="flex flex-col gap-1 w-[85%]">
                                <label htmlFor="name" className="text-xs font-black text-[#171717] uppercase tracking-wider">
                                    Full Name
                                </label>
                                <input id='name' type="text" className="border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl w-full h-[42px] px-4 bg-[#FAFAFC] text-[#171717] outline-none font-medium shadow-sm transition-all" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)} value={name} />
                            </div>
                            <div className="flex flex-col gap-1 w-[85%]">
                                <label htmlFor="email" className="text-xs font-black text-[#171717] uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input id='email' type="text" className="border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl w-full h-[42px] px-4 bg-[#FAFAFC] text-[#171717] outline-none font-medium shadow-sm transition-all" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} value={email} />
                            </div>
                            <div className="flex flex-col gap-1 w-[85%] relative">
                                <label htmlFor="password" className="text-xs font-black text-[#171717] uppercase tracking-wider">
                                    Password
                                </label>
                                <input id='password' type={show?"text":"password"} className="border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl w-full h-[42px] px-4 bg-[#FAFAFC] text-[#171717] outline-none font-medium shadow-sm transition-all" placeholder="••••••••" onChange={(e)=>setPassword(e.target.value)} value={password}/>
                                {!show ? (
                                    <MdOutlineRemoveRedEye className="absolute right-4 top-9 cursor-pointer text-gray-400 hover:text-[#5B21B6] text-lg" onClick={()=>setShow(prev => !prev)}/>
                                ) : (
                                    <MdRemoveRedEye className="absolute right-4 top-9 cursor-pointer text-[#5B21B6] text-lg" onClick={()=>setShow(prev => !prev)} />
                                )}
                            </div>
                            <div className="flex gap-3 w-[85%]">
                                <button
                                    type="button"
                                    className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${role === 'student' ? "bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm" : "bg-white border-[#EEEEF2] text-[#666666] hover:bg-[#F5F0FF]"}`}
                                    onClick={()=>setRole("student")}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${role === 'educator' ? "bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm" : "bg-white border-[#EEEEF2] text-[#666666] hover:bg-[#F5F0FF]"}`}
                                    onClick={()=>setRole("educator")}
                                >
                                    Educator
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 w-[85%] text-center">
                                <p className="text-[#666666] text-sm">We sent a 4-digit verification code to <span className="font-bold text-[#5B21B6]">{email}</span></p>
                                <label htmlFor="otp" className="text-xs font-black text-[#171717] uppercase tracking-wider mt-2">
                                    Enter 4-Digit OTP
                                </label>
                                <input id='otp' type="text" className="border-2 border-[#5B21B6] w-full h-[48px] rounded-xl text-center text-2xl font-bold tracking-[0.3em] outline-none text-[#171717] bg-[#FAFAFC]" placeholder="1234" maxLength={4} onChange={(e)=>setOtp(e.target.value)} value={otp} />
                            </div>
                            <span className="text-xs text-[#5B21B6] font-bold cursor-pointer underline underline-offset-2 hover:text-[#4C1D95]" onClick={() => setStep(1)}>
                                Edit Email / Change details
                            </span>
                        </>
                    )}

                    <button className="w-[85%] h-[48px] bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold rounded-xl shadow-[0_4px_16px_rgba(91,33,182,0.25)] hover:shadow-[0_6px_22px_rgba(91,33,182,0.35)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center mt-2" disabled={loading} onClick={handleSignUp}>
                        {loading ? <ClipLoader size={24} color='white' /> : (step === 1 ? "Send Verification OTP" : "Verify & Create Account")}
                    </button>
                    
                    <div className="w-[85%] flex items-center gap-2">
                        <div className="flex-1 h-[1px] bg-[#EEEEF2]"></div>
                        <div className="text-[11px] text-[#666666] font-bold uppercase tracking-wider">Or continue with</div>
                        <div className="flex-1 h-[1px] bg-[#EEEEF2]"></div>
                    </div>
                    
                    <div className="w-[85%] h-[46px] border border-[#EEEEF2] hover:bg-gray-50 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-[#171717] transition-all shadow-sm" onClick={googleSignUp}>
                        <img src={google} alt="google" className="w-5" />
                        <span className="text-sm">Continue with Google</span>
                    </div>
                    
                    <div className="text-xs text-[#666666] font-medium">
                        Already have an account? <span className="underline text-[#5B21B6] font-bold cursor-pointer hover:text-[#4C1D95]" onClick={()=>navigate("/login")}>Log in</span>
                    </div>
                </div>
                
                <div className="w-[45%] bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#4C1D95] hidden md:flex flex-col items-center justify-center p-8 text-center text-white relative">
                    <img src={logo} className="w-24 rounded-2xl border-4 border-white/80 shadow-2xl mb-4 object-cover" alt="Logo" />
                    <h3 className="text-3xl font-black tracking-tight">Learn<span className="text-[#FC8019]">AI</span></h3>
                    <p className="text-xs text-white/85 mt-2 max-w-xs leading-relaxed font-medium">
                        Start your personalized learning path with intelligent tools, interactive simulations, and expert mentorship.
                    </p>
                </div>
            </form>
        </div>
    )
}

export default SignUp
