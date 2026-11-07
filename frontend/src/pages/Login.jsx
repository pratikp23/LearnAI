import React, { useState } from "react";
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      const dest = location.state?.from?.pathname || "/";
      navigate(dest);

      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message || "Login failed");
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
        },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      const dest = location.state?.from?.pathname || "/";
      navigate(dest);

      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-['Outfit']">
      <form
        className="w-[95%] md:w-[840px] min-h-[580px] bg-white shadow-2xl rounded-3xl flex overflow-hidden border border-[var(--glass-border)] animate-slide-up"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* LEFT */}
        <div className="md:w-[55%] w-full flex flex-col items-center justify-center p-8 md:p-12 gap-5">
          <div className="text-center md:text-left w-[85%]">
            <h1 className="font-extrabold text-[var(--dark-brown)] text-3xl">
              Welcome Back
            </h1>
            <h2 className="text-[var(--accent-color)] text-sm font-semibold mt-1">
              Log in to continue your learning journey
            </h2>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1.5 w-[85%]">
            <label className="text-xs font-bold text-[var(--dark-brown)] uppercase tracking-wider">Email</label>
            <input
              type="text"
              className="border border-[var(--glass-border)] rounded-xl w-full h-[44px] px-4 bg-white text-[#1a1a1a] outline-none focus:border-[var(--neon-blue)] font-medium shadow-sm transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5 w-[85%] relative">
            <label className="text-xs font-bold text-[var(--dark-brown)] uppercase tracking-wider">Password</label>
            <input
              type={show ? "text" : "password"}
              className="border border-[var(--glass-border)] rounded-xl w-full h-[44px] px-4 bg-white text-[#1a1a1a] outline-none focus:border-[var(--neon-blue)] font-medium shadow-sm transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {!show ? (
              <MdOutlineRemoveRedEye
                className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-[var(--deep-green)] text-lg"
                onClick={() => setShow(true)}
              />
            ) : (
              <MdRemoveRedEye
                className="absolute right-4 top-9 cursor-pointer text-[var(--deep-green)] text-lg"
                onClick={() => setShow(false)}
              />
            )}
          </div>

          {/* ROLE */}
          <div className="flex gap-3 w-[85%]">
            <button
              type="button"
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                role === "student"
                  ? "bg-[#3E5F44] text-white border-[#3E5F44] shadow-sm"
                  : "bg-white/80 border-[var(--glass-border)] text-[var(--dark-brown)] hover:bg-[#5F8D4E]/10"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </button>

            <button
              type="button"
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                role === "educator"
                  ? "bg-[#3E5F44] text-white border-[#3E5F44] shadow-sm"
                  : "bg-white/80 border-[var(--glass-border)] text-[var(--dark-brown)] hover:bg-[#5F8D4E]/10"
              }`}
              onClick={() => setRole("educator")}
            >
              Educator
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="w-[85%] h-[46px] bg-[#3E5F44] hover:bg-[#2e4733] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center mt-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Log In"}
          </button>

          <span
            className="text-xs cursor-pointer text-[var(--accent-color)] hover:text-[var(--deep-green)] font-bold"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot password?
          </span>

          {/* GOOGLE */}
          <div
            className="w-[85%] h-[44px] border-2 border-[var(--glass-border)] hover:bg-[#5F8D4E]/10 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-[var(--dark-brown)] transition-all shadow-sm"
            onClick={googleLogin}
          >
            <img src={google} alt="google" className="w-5" />
            <span className="text-sm">Continue with Google</span>
          </div>

          <div className="text-xs text-[var(--body-text)] font-medium">
            Don't have an account?{" "}
            <span
              className="underline text-[var(--deep-green)] font-bold cursor-pointer hover:text-[#2e4733]"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[45%] bg-gradient-to-br from-[#3E5F44] to-[#5C4033] hidden md:flex flex-col items-center justify-center p-8 text-center text-white relative">
          <img src={logo} className="w-24 rounded-full border-4 border-white shadow-2xl mb-4" alt="logo" />
          <h3 className="text-2xl font-bold font-['Playfair_Display']">LearnAI</h3>
          <p className="text-xs text-white/80 mt-2 max-w-xs leading-relaxed">
            Empower your intelligence with AI-driven learning paths, quizzes, and personalized roadmaps.
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
