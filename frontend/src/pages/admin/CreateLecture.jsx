import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPlus, FaVideo } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';
import { FaArrowLeftLong, FaRegPenToSquare } from 'react-icons/fa6';

function CreateLecture() {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const [lectureTitle, setLectureTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { lectureData } = useSelector(state => state.lecture)

    const createLectureHandler = async () => {
        if (!lectureTitle) return toast.error("Please enter a lecture title")
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true })
            dispatch(setLectureData([...lectureData, result.data.lecture]))
            toast.success("Lecture Added to Course")
            setLectureTitle("")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add lecture")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getLecture = async () => {
            try {
                const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`, { withCredentials: true })
                dispatch(setLectureData(result.data.lectures))
            } catch (error) {
                console.log(error)
            }
        }
        getLecture()
    }, [courseId, dispatch])

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center bg-[#FAFAFC] text-[#171717]">
            <div className="max-w-3xl w-full animate-fade-in">
                {/* Header Card */}
                <div className="bg-white p-10 rounded-3xl mb-8 border border-[#EEEEF2] shadow-sm relative">
                    <FaArrowLeftLong
                        className="absolute top-8 left-8 text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
                        onClick={() => navigate(`/addcourses/${courseId}`)}
                    />
                    
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#F5F0FF] rounded-2xl flex items-center justify-center text-[#5B21B6] mb-4 border border-[#DDD6FE] shadow-sm">
                            <FaVideo size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-[#171717] tracking-tight">Curriculum Builder</h1>
                        <p className="text-[#666666] text-sm mt-2 text-center max-w-md font-medium">Organize your course by adding lectures. You can upload videos for each lecture after creating them.</p>
                    </div>
                </div>

                {/* Add Lecture Form */}
                <div className="bg-white p-8 rounded-3xl mb-8 border border-[#EEEEF2] shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="e.g. Introduction to the course"
                            className="flex-1 px-5 py-3.5 bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl font-medium text-[#171717] outline-none shadow-sm"
                            onChange={(e) => setLectureTitle(e.target.value)}
                            value={lectureTitle}
                        />
                        <button 
                            className="px-8 py-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                            disabled={loading}
                            onClick={createLectureHandler}
                        >
                            {loading ? <ClipLoader size={20} color="white" /> : <><FaPlus /> Add Lecture</>}
                        </button>
                    </div>
                </div>

                {/* Lecture List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-[#5B21B6] uppercase tracking-wider ml-4 mb-4">Course Content ({lectureData.length})</h3>
                    {lectureData.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl text-center border border-[#EEEEF2] shadow-sm">
                            <p className="text-[#666666] italic font-medium">No lectures added yet. Start building your curriculum!</p>
                        </div>
                    ) : (
                        lectureData.map((lecture, index) => (
                            <div key={lecture._id} className="bg-white p-5 rounded-2xl border border-[#EEEEF2] shadow-sm flex justify-between items-center group hover:border-[#DDD6FE] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#F5F0FF] text-[#5B21B6] border border-[#DDD6FE] flex items-center justify-center text-sm font-black">
                                        {index + 1}
                                    </div>
                                    <span className="text-[#171717] font-bold group-hover:text-[#5B21B6] transition-colors">
                                        {lecture.lectureTitle}
                                    </span>
                                </div>
                                <button 
                                    className="p-3 bg-[#FAFAFC] hover:bg-[#F5F0FF] border border-[#EEEEF2] rounded-xl text-[#5B21B6] transition-all active:scale-95 cursor-pointer shadow-sm"
                                    onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                                >
                                    <FaRegPenToSquare size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateLecture
