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
      <div className="glass-card p-10 max-w-2xl w-full relative animate-slide-up rounded-3xl border border-[var(--glass-border)] shadow-2xl">
        <FaArrowLeftLong
          className="absolute top-8 left-8 text-2xl text-[var(--dark-brown)] hover:text-[var(--deep-green)] cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        />

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--deep-green)] to-[var(--neon-blue)] rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
            {userData.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt={userData.name}
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : null}
            <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-[var(--deep-green)] to-[var(--neon-blue)] flex items-center justify-center text-5xl font-extrabold text-white border-4 border-white shadow-lg ${userData.photoUrl ? 'hidden' : 'flex'}`}>
              {userData?.name?.slice(0, 1).toUpperCase() || "U"}
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mt-6 tracking-tight text-[var(--dark-brown)]">{userData.name}</h2>
          <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-white/70 border border-[var(--glass-border)] rounded-full shadow-sm">
            <FaUserTag className="text-[var(--deep-green)]" />
            <span className="text-xs uppercase tracking-widest text-[var(--deep-green)] font-bold">{userData.role}</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-12 space-y-5">
          <div className="flex items-start gap-4 p-4 bg-white/70 border border-[var(--glass-border)] rounded-2xl hover:bg-white transition-colors shadow-sm">
            <div className="p-3 bg-[var(--neon-blue)]/15 rounded-xl text-[var(--deep-green)]">
              <FaEnvelope size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--accent-color)] uppercase tracking-wider mb-1 font-bold">Email Address</p>
              <p className="text-[var(--body-text)] font-semibold">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/70 border border-[var(--glass-border)] rounded-2xl hover:bg-white transition-colors shadow-sm">
            <div className="p-3 bg-[var(--neon-purple)]/15 rounded-xl text-[var(--deep-green)]">
              <FaBookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--accent-color)] uppercase tracking-wider mb-1 font-bold">Bio / Description</p>
              <p className="text-[var(--body-text)] leading-relaxed">{userData.description || "No bio added yet."}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/70 border border-[var(--glass-border)] rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/15 rounded-xl text-[var(--deep-green)]">
                <FaBookOpen size={20} />
              </div>
              <p className="text-[var(--body-text)] font-bold">Enrolled Courses</p>
            </div>
            <span className="text-2xl font-bold text-[var(--deep-green)]">{userData.enrolledCourses?.length || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--deep-green)] to-[var(--neon-blue)] text-white font-bold hover:shadow-lg transition-all active:scale-95 cursor-pointer shadow-md text-center"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
          <button
            className="px-8 py-4 rounded-xl bg-white/80 text-red-600 border border-red-200 hover:bg-red-50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-bold shadow-sm"
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
