import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong, FaCamera } from "react-icons/fa6";

function EditProfile() {
  const { userData } = useSelector(state => state.user)
  const [name, setName] = useState(userData?.name || "")
  const [description, setDescription] = useState(userData?.description || "")
  const [photoUrl, setPhotoUrl] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(userData?.photoUrl || null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!userData) {
    return null;
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    setPhotoUrl(file)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    if (photoUrl) formData.append("photoUrl", photoUrl)

    try {
      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true })
      dispatch(setUserData(result.data))
      toast.success("Profile Updated Successfully")
      navigate("/profile")
    } catch (error) {
      toast.error("Profile Update Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#FAFAFC]">
      <div className="bg-white p-10 max-w-xl w-full relative animate-slide-up rounded-3xl border border-[#EEEEF2] shadow-[0_12px_40px_rgba(91,33,182,0.08)]">
        <FaArrowLeftLong
          className="absolute top-8 left-8 text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-3xl font-black text-center text-[#171717] mb-10 tracking-tight">Edit Profile</h2>

        <form className="space-y-6" onSubmit={updateProfile}>
          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                  className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : null}
              <div className={`relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] flex items-center justify-center text-4xl font-black text-white border-4 border-white shadow-lg ${previewUrl ? 'hidden' : 'flex'}`}>
                {userData?.name?.slice(0, 1).toUpperCase() || "U"}
              </div>
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-2.5 bg-[#FC8019] hover:bg-[#E86F07] rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white">
                <FaCamera size={16} />
              </label>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
            <p className="text-xs text-[#5B21B6] mt-3 uppercase tracking-wider font-extrabold">Update Avatar</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#171717] uppercase tracking-wider ml-1">Full Name</label>
            <input
              type="text"
              className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl font-medium text-[#171717] outline-none transition-all shadow-sm"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#171717] uppercase tracking-wider ml-1">Email Address (Locked)</label>
            <input
              type="email"
              readOnly
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
              value={userData.email}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#171717] uppercase tracking-wider ml-1">Bio / Professional Summary</label>
            <textarea
              className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl resize-none font-medium text-[#171717] outline-none transition-all h-28 shadow-sm"
              placeholder="Tell us about yourself..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-black text-lg shadow-[0_4px_16px_rgba(91,33,182,0.25)] hover:shadow-[0_6px_22px_rgba(91,33,182,0.35)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
