import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Nav() {
  let [showHam, setShowHam] = useState(false);
  let [showPro, setShowPro] = useState(false);
  let [scrolled, setScrolled] = useState(false);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      console.log(result.data);
      localStorage.removeItem("token");
      await dispatch(setUserData(null));
      toast.success("LogOut Successfully");
      setShowPro(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      await dispatch(setUserData(null));
      toast.error(error?.response?.data?.message || error.message || "Logout failed");
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md py-3 border-b border-[#EEEEF2] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            : "bg-white/95 backdrop-blur-md py-4 border-b border-[#EEEEF2] shadow-xs"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src={logo}
              className="w-[46px] h-[46px] rounded-2xl border-2 border-[#7C3AED] shadow-[0_4px_14px_rgba(124,58,237,0.2)] hover:scale-105 transition-transform object-cover"
              alt="Logo"
            />
            <span className="text-2xl font-black tracking-tight" style={{ color: "#5B21B6" }}>
              Learn<span style={{ color: "#FC8019" }}>AI</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <span
              className="cursor-pointer transition-all duration-200 font-bold text-[17px] tracking-wide px-1 pb-0.5 border-b-2 border-transparent hover:border-[#5B21B6]"
              style={{ color: "#171717" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#5B21B6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#171717")}
              onClick={() => navigate("/allcourses")}
            >
              Courses
            </span>
            <span
              className="cursor-pointer transition-all duration-200 font-bold text-[17px] tracking-wide px-1 pb-0.5 border-b-2 border-transparent hover:border-[#5B21B6]"
              style={{ color: "#171717" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#5B21B6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#171717")}
              onClick={() => navigate("/ai-hub")}
            >
              AI Hub
            </span>
            {userData?.role === "educator" && (
              <span
                className="cursor-pointer transition-all duration-200 font-bold text-[17px] tracking-wide px-1 pb-0.5 border-b-2 border-transparent hover:border-[#5B21B6]"
                style={{ color: "#171717" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#5B21B6")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#171717")}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              {!userData ? (
                <button
                  className="px-7 py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-full transition-all duration-200 font-bold shadow-[0_4px_14px_rgba(91,33,182,0.25)] hover:shadow-[0_6px_20px_rgba(91,33,182,0.35)] cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              ) : (
                <div
                  className="w-[46px] h-[46px] rounded-full border-2 border-[#7C3AED] cursor-pointer overflow-hidden p-[2px] hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                  onClick={() => setShowPro((prev) => !prev)}
                >
                  {userData?.photoUrl ? (
                    <img
                      src={userData?.photoUrl}
                      className="w-full h-full rounded-full object-cover"
                      alt="Profile"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] text-white font-bold text-lg flex items-center justify-center rounded-full"
                    style={{ display: userData?.photoUrl ? "none" : "flex" }}
                  >
                    {userData?.name ? userData.name.slice(0, 1).toUpperCase() : "U"}
                  </div>
                </div>
              )}

              {/* Dropdown Menu */}
              {showPro && userData && (
                <div className="absolute top-[120%] right-0 w-60 bg-white rounded-2xl overflow-hidden animate-slide-up flex flex-col p-2 border border-[#EEEEF2] shadow-[0_12px_35px_rgba(91,33,182,0.1)]">
                  <div className="px-4 py-3 mb-1 border-b border-[#EEEEF2] bg-[#F5F0FF]/60 rounded-xl">
                    <p className="text-[11px] text-[#7C3AED] uppercase tracking-wider font-extrabold">Account</p>
                    <p className="text-sm text-[#171717] font-bold truncate">{userData?.name}</p>
                  </div>
                  <span
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F0FF] rounded-xl cursor-pointer text-[#171717] hover:text-[#5B21B6] font-semibold transition-all"
                    onClick={() => {
                      navigate("/profile");
                      setShowPro(false);
                    }}
                  >
                    <IoMdPerson size={18} className="text-[#5B21B6]" />
                    My Profile
                  </span>
                  <span
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F0FF] rounded-xl cursor-pointer text-[#171717] hover:text-[#5B21B6] font-semibold transition-all"
                    onClick={() => {
                      navigate("/enrolledcourses");
                      setShowPro(false);
                    }}
                  >
                    <FaBookOpen size={16} className="text-[#5B21B6]" />
                    My Courses
                  </span>
                  <div className="h-[1px] bg-[#EEEEF2] my-1 mx-2"></div>
                  <span
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-[#DC2626] hover:text-red-700 font-bold rounded-xl cursor-pointer transition-all"
                    onClick={handleLogout}
                  >
                    <MdLogout size={18} />
                    Log Out
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <GiHamburgerMenu
            className="lg:hidden w-8 h-8 text-[#5B21B6] cursor-pointer"
            onClick={() => setShowHam(true)}
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white/98 backdrop-blur-2xl z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-500 ${
          showHam ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <GiSplitCross
          className="absolute top-8 right-8 w-9 h-9 text-[#171717] hover:text-[#5B21B6] cursor-pointer hover:rotate-90 transition-transform"
          onClick={() => setShowHam(false)}
        />

        {!userData ? (
          <button
            className="px-10 py-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-full text-xl font-extrabold transition-all shadow-[0_4px_16px_rgba(91,33,182,0.3)]"
            onClick={() => {
              navigate("/login");
              setShowHam(false);
            }}
          >
            Login
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full border-3 border-[#7C3AED] p-1 shadow-md">
              {userData?.photoUrl ? (
                <img
                  src={userData?.photoUrl}
                  className="w-full h-full rounded-full object-cover"
                  alt="Profile"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] rounded-full flex items-center justify-center text-white font-black text-3xl"
                style={{ display: userData?.photoUrl ? "none" : "flex" }}
              >
                {userData?.name ? userData.name.slice(0, 1).toUpperCase() : "U"}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#171717]">{userData?.name}</h3>
          </div>
        )}

        <div className="flex flex-col gap-5 text-center">
          <span
            className="text-xl font-bold text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
            onClick={() => {
              navigate("/");
              setShowHam(false);
            }}
          >
            Home
          </span>
          <span
            className="text-xl font-bold text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
            onClick={() => {
              navigate("/allcourses");
              setShowHam(false);
            }}
          >
            All Courses
          </span>
          <span
            className="text-xl font-bold text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
            onClick={() => {
              navigate("/ai-hub");
              setShowHam(false);
            }}
          >
            AI Hub
          </span>
          {userData && (
            <>
              <span
                className="text-xl font-bold text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
                onClick={() => {
                  navigate("/profile");
                  setShowHam(false);
                }}
              >
                My Profile
              </span>
              <span
                className="text-xl font-bold text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
                onClick={() => {
                  navigate("/enrolledcourses");
                  setShowHam(false);
                }}
              >
                My Courses
              </span>
              {userData?.role === "educator" && (
                <span
                  className="text-xl font-bold text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
                  onClick={() => {
                    navigate("/dashboard");
                    setShowHam(false);
                  }}
                >
                  Dashboard
                </span>
              )}
              <span
                className="text-xl font-bold text-[#DC2626] hover:text-red-700 cursor-pointer transition-colors mt-2"
                onClick={() => {
                  handleLogout();
                  setShowHam(false);
                }}
              >
                Log Out
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Nav;
