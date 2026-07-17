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
  const [name, setName] = useState(userData.name || "")
  const [description, setDescription] = useState(userData.description || "")
  const [photoUrl, setPhotoUrl] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(userData.photoUrl || null)
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
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass-card p-10 max-w-xl w-full relative animate-slide-up rounded-3xl">
        <FaArrowLeftLong
          className="absolute top-8 left-8 text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-3xl font-bold text-center text-white mb-10 tracking-tight">Edit Profile</h2>

        <form className="space-y-8" onSubmit={updateProfile}>
          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="relative w-28 h-28 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="relative w-28 h-28 rounded-full bg-black/40 flex items-center justify-center text-3xl font-bold text-white border-2 border-white/20">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-2 bg-[var(--neon-blue)] rounded-full text-black cursor-pointer hover:scale-110 transition-transform shadow-lg">
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
            <p className="text-xs text-gray-400 mt-3 uppercase tracking-widest font-semibold">Update Avatar</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              className="w-full px-5 py-4 input-dark rounded-xl font-medium"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address (Locked)</label>
            <input
              type="email"
              readOnly
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-gray-500 cursor-not-allowed font-medium"
              value={userData.email}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bio / Professional Summary</label>
            <textarea
              className="w-full px-5 py-4 input-dark rounded-xl resize-none font-medium h-32"
              placeholder="Tell us about yourself..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-extrabold text-lg shadow-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="black" /> : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile

