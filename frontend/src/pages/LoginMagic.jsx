import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import DotGridBackground from "../components/DotGridBackground";

function LoginMagic() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    const performMagicLogin = async () => {
      if (!token) {
        setError("Invalid link. No authentication token found.");
        toast.error("Invalid magic link");
        navigate("/login");
        return;
      }

      try {
        const result = await axios.post(
          serverUrl + "/api/auth/login-magic",
          { token },
          { withCredentials: true }
        );

        if (result.data?.token) {
          localStorage.setItem("token", result.data.token);
        }
        dispatch(setUserData(result.data));
        toast.success("Logged in successfully using Magic Link!");
        navigate("/");
      } catch (err) {
        console.error("Magic login error:", err);
        const errMsg = err?.response?.data?.message || err.message || "Failed to log in via magic link.";
        setError(errMsg);
        toast.error(errMsg);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    performMagicLogin();
  }, [token, dispatch, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAFAFC] relative overflow-hidden">
      <DotGridBackground />
      <div className="bg-white shadow-[0_12px_45px_rgba(91,33,182,0.08)] rounded-3xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4 border border-[#EEEEF2] animate-slide-up relative z-10">
        <h1 className="text-2xl font-black text-[#171717]">Magic Login</h1>
        
        {!error ? (
          <>
            <ClipLoader size={50} color="#5B21B6" />
            <p className="text-[#666666] font-medium">Verifying your secure login link... Please wait.</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold">!</div>
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-gray-500 text-sm">Redirecting to the login page...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginMagic;
