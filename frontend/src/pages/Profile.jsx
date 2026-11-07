import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong, FaEnvelope, FaUserTag, FaBookOpen } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'

function Profile() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  if (!userData) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#FAFAFC]">
      <div className="bg-white p-10 max-w-2xl w-full relative animate-slide-up rounded-3xl border border-[#EEEEF2] shadow-[0_12px_40px_rgba(91,33,182,0.08)]">
        <FaArrowLeftLong
          className="absolute top-8 left-8 text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        />

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
            {userData.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt={userData.name}
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : null}
            <div className={`relative w-32 h-32 rounded-full bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] flex items-center justify-center text-5xl font-black text-white border-4 border-white shadow-lg ${userData.photoUrl ? 'hidden' : 'flex'}`}>
              {userData?.name?.slice(0, 1).toUpperCase() || "U"}
            </div>
          </div>
          <h2 className="text-3xl font-black mt-6 tracking-tight text-[#171717]">{userData.name}</h2>
          <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-[#F5F0FF] border border-[#DDD6FE] rounded-full shadow-sm">
            <FaUserTag className="text-[#5B21B6]" />
            <span className="text-xs uppercase tracking-wider text-[#5B21B6] font-black">{userData.role}</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-12 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl shadow-sm">
            <div className="p-3 bg-[#F5F0FF] rounded-xl text-[#5B21B6] border border-[#DDD6FE]">
              <FaEnvelope size={20} />
            </div>
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1 font-bold">Email Address</p>
              <p className="text-[#171717] font-semibold">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl shadow-sm">
            <div className="p-3 bg-[#FFF3E8] rounded-xl text-[#FC8019] border border-[#FED7AA]">
              <FaBookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1 font-bold">Bio / Description</p>
              <p className="text-[#171717] leading-relaxed font-medium">{userData.description || "No bio added yet."}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-[#16A34A] border border-emerald-200">
                <FaBookOpen size={20} />
              </div>
              <p className="text-[#171717] font-bold">Enrolled Courses</p>
            </div>
            <span className="text-2xl font-black text-[#5B21B6]">{userData.enrolledCourses?.length || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 px-8 py-4 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold transition-all active:scale-95 cursor-pointer shadow-[0_4px_14px_rgba(91,33,182,0.25)] text-center"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
          <button
            className="px-8 py-4 rounded-xl bg-white text-[#DC2626] border border-red-200 hover:bg-red-50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-bold shadow-sm"
            onClick={handleLogout}
          >
            <MdLogout size={20} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
