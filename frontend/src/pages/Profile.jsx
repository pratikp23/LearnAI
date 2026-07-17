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
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass-card p-10 max-w-2xl w-full relative animate-slide-up rounded-3xl">
        <FaArrowLeftLong
          className="absolute top-8 left-8 text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        />

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            {userData.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt={userData.name}
                className="relative w-32 h-32 rounded-full object-cover border-2 border-white/10"
              />
            ) : (
              <div className="relative w-32 h-32 rounded-full bg-black/40 flex items-center justify-center text-4xl font-bold text-white border-2 border-white/10">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="text-3xl font-extrabold mt-6 tracking-tight text-white">{userData.name}</h2>
          <div className="flex items-center gap-2 mt-2 px-4 py-1 glass rounded-full">
            <FaUserTag className="text-[var(--neon-blue)]" />
            <span className="text-xs uppercase tracking-widest text-gray-300 font-semibold">{userData.role}</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-12 space-y-6">
          <div className="flex items-start gap-4 p-4 glass rounded-2xl hover:bg-white/5 transition-colors">
            <div className="p-3 bg-[var(--neon-blue)]/10 rounded-xl text-[var(--neon-blue)]">
              <FaEnvelope size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-white font-medium">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 glass rounded-2xl hover:bg-white/5 transition-colors">
            <div className="p-3 bg-[var(--neon-purple)]/10 rounded-xl text-[var(--neon-purple)]">
              <FaBookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bio / Description</p>
              <p className="text-gray-200 leading-relaxed">{userData.description || "No bio added yet."}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 glass rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                <FaBookOpen size={20} />
              </div>
              <p className="text-gray-300">Enrolled Courses</p>
            </div>
            <span className="text-2xl font-bold text-white">{userData.enrolledCourses.length}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-blue)]/80 text-black font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all active:scale-95 cursor-pointer"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
          <button
            className="px-8 py-4 rounded-xl glass text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
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

