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
      setScrolled(window.scrollY > 50);
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
      await dispatch(setUserData(null));
      toast.success("LogOut Successfully");
      setShowPro(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message || "Logout failed");
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass py-2" : "py-4 bg-transparent"
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src={logo}
              className="w-[50px] rounded-full border-2 border-[var(--neon-blue)] shadow-[0_0_15px_rgba(95,141,78,0.2)] hover:scale-105 transition-transform"
              alt="Logo"
            />
            <span className="text-2xl font-bold text-white tracking-wide">
              Learn<span className="text-[#3d2110]">AI</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <span
              className="text-gray-300 hover:text-white cursor-pointer transition-colors font-light text-lg"
              onClick={() => navigate("/allcourses")}
            >
              Courses
            </span>
            <span
              className="text-gray-300 hover:text-[var(--neon-blue)] cursor-pointer transition-colors font-light text-lg"
              onClick={() => navigate("/ai-hub")}
            >
              AI Hub
            </span>
            {userData?.role === "educator" && (
              <span
                className="text-gray-300 hover:text-white cursor-pointer transition-colors font-light text-lg"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              {!userData ? (
                <button
                  className="px-6 py-2 border border-[var(--neon-blue)] text-[var(--neon-blue)] rounded-full hover:bg-[var(--neon-blue)] hover:text-black transition-all duration-300 font-medium btn-glow"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              ) : (
                <div
                  className="w-[50px] h-[50px] rounded-full border-2 border-[var(--neon-purple)] cursor-pointer overflow-hidden p-[2px] hover:shadow-[0_0_15px_rgba(188,19,254,0.5)] transition-all"
                  onClick={() => setShowPro((prev) => !prev)}
                >
                  {userData?.photoUrl ? (
                    <img
                      src={userData?.photoUrl}
                      className="w-full h-full rounded-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--primary-bg)] flex items-center justify-center text-white font-bold text-xl">
                      {userData?.name ? userData.name.slice(0, 1).toUpperCase() : ""}
                    </div>
                  )}
                </div>
              )}

            {/* Dropdown Menu */}
              {showPro && userData && (
                <div className="absolute top-[120%] right-0 w-56 glass rounded-2xl overflow-hidden animate-slide-up flex flex-col p-2 border border-white/10 shadow-2xl">
                  <div className="px-4 py-3 mb-2 border-b border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Account</p>
                    <p className="text-sm text-white font-medium truncate">{userData?.name}</p>
                  </div>
                  <span
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 rounded-xl cursor-pointer text-gray-300 hover:text-[var(--neon-blue)] transition-all"
                    onClick={() => { navigate("/profile"); setShowPro(false) }}
                  >
                    <IoMdPerson size={18} />
                    My Profile
                  </span>
                  <span
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 rounded-xl cursor-pointer text-gray-300 hover:text-[var(--neon-blue)] transition-all"
                    onClick={() => { navigate("/enrolledcourses"); setShowPro(false) }}
                  >
                    <FaBookOpen size={16} />
                    My Courses
                  </span>
                  <div className="h-[1px] bg-white/5 my-2 mx-2"></div>
                  <span
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl cursor-pointer transition-all"
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
            className="lg:hidden w-8 h-8 text-white cursor-pointer"
            onClick={() => setShowHam(true)}
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#0f0c29fa] backdrop-blur-xl z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-500 ${showHam ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <GiSplitCross
          className="absolute top-8 right-8 w-10 h-10 text-white cursor-pointer hover:rotate-90 transition-transform"
          onClick={() => setShowHam(false)}
        />

        {!userData ? (
          <button
            className="px-10 py-3 border border-[var(--neon-blue)] text-[var(--neon-blue)] rounded-full text-xl hover:bg-[var(--neon-blue)] hover:text-black transition-all btn-glow"
            onClick={() => { navigate("/login"); setShowHam(false) }}
          >
            Login
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-[var(--neon-purple)] p-1">
              {userData?.photoUrl ? (
                <img
                  src={userData?.photoUrl}
                  className="w-full h-full rounded-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full bg-[var(--primary-bg)] rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {userData?.name ? userData.name.slice(0, 1).toUpperCase() : ""}
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white">{userData?.name}</h3>
          </div>
        )}

        <div className="flex flex-col gap-4 text-center">
          <span className="text-xl text-gray-300 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" onClick={() => { navigate("/"); setShowHam(false) }}>Home</span>
          <span className="text-xl text-gray-300 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" onClick={() => { navigate("/allcourses"); setShowHam(false) }}>All Courses</span>
          <span className="text-xl text-gray-300 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" onClick={() => { navigate("/ai-hub"); setShowHam(false) }}>AI Hub</span>
          {userData && (
            <>
              <span className="text-xl text-gray-300 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" onClick={() => { navigate("/profile"); setShowHam(false) }}>My Profile</span>
              <span className="text-xl text-gray-300 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" onClick={() => { navigate("/enrolledcourses"); setShowHam(false) }}>My Courses</span>
              {userData?.role === "educator" && (
                <span className="text-xl text-gray-300 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" onClick={() => { navigate("/dashboard"); setShowHam(false) }}>Dashboard</span>
              )}
              <span className="text-xl text-red-500 hover:text-red-400 cursor-pointer transition-colors mt-4" onClick={() => { handleLogout(); setShowHam(false) }}>Log Out</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Nav;