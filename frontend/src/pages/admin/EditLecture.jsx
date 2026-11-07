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
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center bg-[#FAFAFC]">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EEEEF2] shadow-sm relative">
                    <button
                        type="button"
                        onClick={() => navigate(`/createlecture/${courseId}`)}
                        className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-[#FAFAFC] hover:bg-[#F5F0FF] border border-[#EEEEF2] hover:border-[#7C3AED]/30 flex items-center justify-center text-[#666666] hover:text-[#5B21B6] transition-all cursor-pointer shadow-sm"
                        title="Back to curriculum"
                    >
                        <FaArrowLeftLong className="text-base" />
                    </button>
                    
                    <div className="flex flex-col items-center mb-8 pt-2">
                        <div className="w-14 h-14 bg-[#F5F0FF] rounded-2xl flex items-center justify-center text-[#5B21B6] mb-3 border border-[#7C3AED]/20 shadow-sm">
                            <FaCircleInfo size={26} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#171717] tracking-tight">Edit Lecture</h2>
                        <p className="text-[#666666] text-sm mt-1 text-center font-medium">Update your lecture title, video content, and preview settings.</p>
                    </div>

                    <form className="space-y-6" onSubmit={editLecture}>
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#666666] uppercase tracking-wider ml-1">Lecture Title</label>
                            <input
                                type="text"
                                className="w-full px-5 py-3.5 bg-white border border-[#EEEEF2] rounded-xl font-medium text-[#171717] placeholder:text-[#666666]/60 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-sm"
                                placeholder="Enter lecture title"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#666666] uppercase tracking-wider ml-1">Video Content</label>
                            <div className="relative group">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#EEEEF2] group-hover:border-[#7C3AED] rounded-2xl cursor-pointer bg-[#FAFAFC] hover:bg-[#F5F0FF]/30 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaCloudArrowUp className="w-10 h-10 mb-2.5 text-[#666666] group-hover:text-[#5B21B6] transition-colors" />
                                        <p className="mb-1 text-sm text-[#171717]">
                                            <span className="font-bold text-[#5B21B6]">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-[#666666] font-medium">MP4, WebM up to 100MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="video/*" onChange={(e) => setVideoUrl(e.target.files[0])} />
                                </label>
                                {videoUrl && (
                                    <div className="mt-3 flex items-center gap-2 text-[#5B21B6] bg-[#F5F0FF] px-4 py-2.5 rounded-xl border border-[#7C3AED]/20 shadow-sm">
                                        <span className="text-xs font-bold truncate">Selected: {videoUrl.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preview Toggle */}
                        <label className="flex items-center gap-4 cursor-pointer group w-fit select-none">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isPreviewFree}
                                    onChange={() => setIsPreviewFree(!isPreviewFree)}
                                />
                                <div className={`block w-13 h-7 rounded-full transition-colors ${isPreviewFree ? 'bg-[#5B21B6]' : 'bg-gray-200'}`}></div>
                                <div className={`absolute left-0.5 top-0.5 bg-white w-6 h-6 rounded-full shadow-md transition-transform ${isPreviewFree ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <span className="text-sm font-bold text-[#171717] group-hover:text-[#5B21B6] transition-colors">Enable Free Preview</span>
                        </label>

                        {loading && (
                            <div className="flex items-center gap-3 text-[#5B21B6] bg-[#F5F0FF] p-3 rounded-xl border border-[#7C3AED]/20 animate-pulse">
                                <ClipLoader size={16} color="#5B21B6" />
                                <span className="text-xs font-bold uppercase tracking-wider">Uploading video... Please wait</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                className="px-6 py-3.5 bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-200 rounded-xl font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                                disabled={loading1}
                                onClick={removeLecture}
                            >
                                {loading1 ? <ClipLoader size={18} color="#DC2626" /> : <><FaTrashCan /> Delete Lecture</>}
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-base rounded-xl shadow-md shadow-[#5B21B6]/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? <ClipLoader size={20} color="white" /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditLecture
