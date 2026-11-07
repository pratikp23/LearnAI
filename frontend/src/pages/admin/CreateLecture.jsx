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
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center">
            <div className="max-w-3xl w-full animate-fade-in">
                {/* Header Card */}
                <div className="glass-card p-10 rounded-3xl mb-8 border border-[#EADBC8] shadow-sm relative">
                    <FaArrowLeftLong
                        className="absolute top-8 left-8 text-2xl text-[#8B6B4A] hover:text-[var(--deep-green)] cursor-pointer transition-colors"
                        onClick={() => navigate(`/addcourses/${courseId}`)}
                    />
                    
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-[var(--deep-green)]/10 rounded-2xl flex items-center justify-center text-[var(--deep-green)] mb-4 border border-[var(--deep-green)]/20 shadow-sm">
                            <FaVideo size={28} />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--dark-brown)] tracking-tight">Curriculum Builder</h1>
                        <p className="text-[#665a4e] text-sm mt-2 text-center max-w-md font-medium">Organize your course by adding lectures. You can upload videos for each lecture after creating them.</p>
                    </div>
                </div>

                {/* Add Lecture Form */}
                <div className="glass-card p-8 rounded-3xl mb-8 border border-[#EADBC8] shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="e.g. Introduction to the course"
                            className="flex-1 px-5 py-4 input-dark rounded-xl font-medium"
                            onChange={(e) => setLectureTitle(e.target.value)}
                            value={lectureTitle}
                        />
                        <button 
                            className="px-8 py-4 bg-[var(--deep-green)] hover:bg-[var(--neon-blue)] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                            disabled={loading}
                            onClick={createLectureHandler}
                        >
                            {loading ? <ClipLoader size={20} color="white" /> : <><FaPlus /> Add Lecture</>}
                        </button>
                    </div>
                </div>

                {/* Lecture List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#8B6B4A] uppercase tracking-widest ml-4 mb-4">Course Content ({lectureData.length})</h3>
                    {lectureData.length === 0 ? (
                        <div className="glass-card p-12 rounded-3xl text-center border border-[#EADBC8] shadow-sm">
                            <p className="text-[#8B6B4A] italic font-medium">No lectures added yet. Start building your curriculum!</p>
                        </div>
                    ) : (
                        lectureData.map((lecture, index) => (
                            <div key={lecture._id} className="glass-card p-5 rounded-2xl border border-[#EADBC8] shadow-sm flex justify-between items-center group hover:border-[var(--deep-green)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--deep-green)]/10 text-[var(--deep-green)] flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="text-[var(--dark-brown)] font-bold group-hover:text-[var(--deep-green)] transition-colors">
                                        {lecture.lectureTitle}
                                    </span>
                                </div>
                                <button 
                                    className="p-3 bg-white/70 hover:bg-white border border-[#EADBC8] rounded-xl text-[var(--dark-brown)] hover:text-[var(--deep-green)] transition-all active:scale-95 cursor-pointer shadow-sm"
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
