import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.png";

import { auth, provider } from "../utils/Firebase";
import axios from "axios";
import { serverUrl } from "../App";

import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import DotGridBackground from "../components/DotGridBackground";
import { getErrorMessage } from "../utils/errorHandler";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
      }
      dispatch(setUserData(result.data));
      const dest = location.state?.from?.pathname || "/";
      navigate(dest);

      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials and try again."));
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const result = await axios.post(
        serverUrl + "/api/auth/googlesignup",
        {
          name: user.displayName,
          email: user.email,
          role,
          isLogin: true,
        },
        { withCredentials: true }
      );

      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
      }
      dispatch(setUserData(result.data));
      const dest = location.state?.from?.pathname || "/";
      navigate(dest);

      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, "Google sign-in failed. Please try again."));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAFAFC] relative overflow-hidden">
      <DotGridBackground />
      <form
        className="w-[95%] md:w-[840px] min-h-[580px] bg-white shadow-[0_12px_45px_rgba(91,33,182,0.08)] rounded-3xl flex overflow-hidden border border-[#EEEEF2] animate-slide-up relative z-10"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* LEFT */}
        <div className="md:w-[55%] w-full flex flex-col items-center justify-center p-8 md:p-12 gap-5">
          <div className="text-center md:text-left w-[85%]">
            <h1 className="font-black text-[#171717] text-3xl">
              Welcome Back
            </h1>
            <h2 className="text-[#666666] text-sm font-medium mt-1">
              Log in to continue your learning journey
            </h2>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1.5 w-[85%]">
            <label className="text-xs font-black text-[#171717] uppercase tracking-wider">Email</label>
            <input
              type="text"
              className="border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl w-full h-[46px] px-4 bg-[#FAFAFC] text-[#171717] outline-none font-medium shadow-sm transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5 w-[85%] relative">
            <label className="text-xs font-black text-[#171717] uppercase tracking-wider">Password</label>
            <input
              type={show ? "text" : "password"}
              className="border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl w-full h-[46px] px-4 bg-[#FAFAFC] text-[#171717] outline-none font-medium shadow-sm transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {!show ? (
              <MdOutlineRemoveRedEye
                className="absolute right-4 top-10 cursor-pointer text-gray-400 hover:text-[#5B21B6] text-lg"
                onClick={() => setShow(true)}
              />
            ) : (
              <MdRemoveRedEye
                className="absolute right-4 top-10 cursor-pointer text-[#5B21B6] text-lg"
                onClick={() => setShow(false)}
              />
            )}
          </div>

          {/* ROLE */}
          <div className="flex gap-3 w-[85%]">
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                role === "student"
                  ? "bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm"
                  : "bg-white border-[#EEEEF2] text-[#666666] hover:bg-[#F5F0FF]"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </button>

            <button
              type="button"
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                role === "educator"
                  ? "bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm"
                  : "bg-white border-[#EEEEF2] text-[#666666] hover:bg-[#F5F0FF]"
              }`}
              onClick={() => setRole("educator")}
            >
              Educator
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="w-[85%] h-[48px] bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold rounded-xl shadow-[0_4px_16px_rgba(91,33,182,0.25)] hover:shadow-[0_6px_22px_rgba(91,33,182,0.35)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center mt-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Log In"}
          </button>

          <span
            className="text-xs cursor-pointer text-[#FC8019] hover:underline font-bold"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot password?
          </span>

          {/* GOOGLE */}
          <div
            className="w-[85%] h-[46px] border border-[#EEEEF2] hover:bg-gray-50 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-[#171717] transition-all shadow-sm"
            onClick={googleLogin}
          >
            <img src={google} alt="google" className="w-5" />
            <span className="text-sm">Continue with Google</span>
          </div>

          <div className="text-xs text-[#666666] font-medium">
            Don't have an account?{" "}
            <span
              className="underline text-[#5B21B6] font-bold cursor-pointer hover:text-[#4C1D95]"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[45%] bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#4C1D95] hidden md:flex flex-col items-center justify-center p-8 text-center text-white relative">
          <img src={logo} className="w-24 rounded-2xl border-4 border-white/80 shadow-2xl mb-4 object-cover" alt="logo" />
          <h3 className="text-3xl font-black tracking-tight">Learn<span className="text-[#FC8019]">AI</span></h3>
          <p className="text-xs text-white/85 mt-2 max-w-xs leading-relaxed font-medium">
            Empower your intelligence with AI-driven learning paths, technical quizzes, and personalized roadmaps.
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
