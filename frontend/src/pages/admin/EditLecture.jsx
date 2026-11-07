import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeftLong, FaCloudArrowUp, FaTrashCan, FaCircleInfo } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function EditLecture() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { courseId, lectureId } = useParams()
    const { lectureData } = useSelector(state => state.lecture)
    
    const selectedLecture = lectureData.find(lecture => lecture._id === lectureId) || {}
    
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)
    const [lectureTitle, setLectureTitle] = useState(selectedLecture.lectureTitle || "")
    const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture.isPreviewFree || false)

    const editLecture = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append("lectureTitle", lectureTitle)
        if (videoUrl) formData.append("videoUrl", videoUrl)
        formData.append("isPreviewFree", isPreviewFree)

        try {
            const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formData, { withCredentials: true })
            const updatedLectures = lectureData.map(l => l._id === lectureId ? result.data : l)
            dispatch(setLectureData(updatedLectures))
            toast.success("Lecture Updated Successfully")
            navigate(`/createlecture/${courseId}`)
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed")
        } finally {
            setLoading(false)
        }
    }

    const removeLecture = async () => {
        if (!window.confirm("Delete this lecture?")) return;
        setLoading1(true)
        try {
            await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true })
            const updatedLectures = lectureData.filter(l => l._id !== lectureId)
            dispatch(setLectureData(updatedLectures))
            toast.success("Lecture Removed")
            navigate(`/createlecture/${courseId}`)
        } catch (error) {
            toast.error("Failed to remove lecture")
        } finally {
            setLoading1(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass-card p-10 rounded-3xl border border-[#EADBC8] shadow-sm relative">
                    <FaArrowLeftLong
                        className="absolute top-8 left-8 text-2xl text-[#8B6B4A] hover:text-[var(--deep-green)] cursor-pointer transition-colors"
                        onClick={() => navigate(`/createlecture/${courseId}`)}
                    />
                    
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-[var(--deep-green)]/10 rounded-2xl flex items-center justify-center text-[var(--deep-green)] mb-4 border border-[var(--deep-green)]/20 shadow-sm">
                            <FaCircleInfo size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-center text-[var(--dark-brown)] tracking-tight">Edit Lecture</h2>
                        <p className="text-[#665a4e] text-sm mt-2 text-center font-medium">Update your content, title, and preview settings.</p>
                    </div>

                    <form className="space-y-8" onSubmit={editLecture}>
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#8B6B4A] uppercase tracking-widest ml-1">Lecture Title</label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 input-dark rounded-xl font-medium"
                                placeholder="Enter lecture title"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#8B6B4A] uppercase tracking-widest ml-1">Video Content</label>
                            <div className="relative group">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#D4C3B3] rounded-2xl cursor-pointer bg-white/60 hover:bg-white hover:border-[var(--deep-green)] transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaCloudArrowUp className="w-10 h-10 mb-3 text-[#8B6B4A] group-hover:text-[var(--deep-green)] transition-colors" />
                                        <p className="mb-2 text-sm text-[var(--dark-brown)]">
                                            <span className="font-bold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-[#8B6B4A] uppercase tracking-widest font-semibold">MP4, WebM up to 100MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="video/*" onChange={(e) => setVideoUrl(e.target.files[0])} />
                                </label>
                                {videoUrl && (
                                    <div className="mt-3 flex items-center gap-2 text-[var(--deep-green)] bg-[var(--deep-green)]/10 px-4 py-2 rounded-lg border border-[var(--deep-green)]/20">
                                        <span className="text-xs font-bold truncate">Selected: {videoUrl.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preview Toggle */}
                        <label className="flex items-center gap-4 cursor-pointer group w-fit">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isPreviewFree}
                                    onChange={() => setIsPreviewFree(!isPreviewFree)}
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${isPreviewFree ? 'bg-[var(--deep-green)]' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform ${isPreviewFree ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <span className="text-sm font-bold text-[var(--dark-brown)] group-hover:text-[var(--deep-green)] transition-colors uppercase tracking-widest">Enable Free Preview</span>
                        </label>

                        {loading && (
                            <div className="flex items-center gap-3 text-[var(--deep-green)] animate-pulse">
                                <ClipLoader size={16} color="var(--deep-green)" />
                                <span className="text-xs font-bold uppercase tracking-widest">Uploading video... Please wait</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                                disabled={loading1}
                                onClick={removeLecture}
                            >
                                {loading1 ? <ClipLoader size={20} color="white" /> : <><FaTrashCan /> Delete Lecture</>}
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-4 bg-[var(--deep-green)] hover:bg-[var(--neon-blue)] text-white font-extrabold text-lg rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? <ClipLoader size={24} color="white" /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditLecture
