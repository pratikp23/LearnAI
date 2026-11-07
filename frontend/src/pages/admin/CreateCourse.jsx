import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong, FaBookMedical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const CreateCourse = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")

    const CreateCourseHandler = async (e) => {
        e.preventDefault()
        if (!title || !category) {
            return toast.error("Please fill all fields")
        }
        setLoading(true)
        try {
            await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
            toast.success("Course Created Successfully")
            navigate("/courses")
            setTitle("")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create course")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#FAFAFC] text-[#171717]">
            <div className="bg-white p-10 max-w-xl w-full relative animate-slide-up rounded-3xl border border-[#EEEEF2] shadow-[0_12px_45px_rgba(91,33,182,0.08)]">
                <FaArrowLeftLong
                    className="absolute top-8 left-8 text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
                    onClick={() => navigate("/courses")}
                />
                
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#F5F0FF] rounded-2xl flex items-center justify-center text-[#5B21B6] mb-4 border border-[#DDD6FE] shadow-sm">
                        <FaBookMedical size={30} />
                    </div>
                    <h2 className="text-3xl font-black text-center text-[#171717] tracking-tight">Create New Course</h2>
                    <p className="text-[#666666] text-sm mt-2 text-center font-medium">Give your course a compelling title and category to get started.</p>
                </div>

                <form className="space-y-6" onSubmit={CreateCourseHandler}>
                    {/* Course Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#171717] uppercase tracking-wider ml-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Master React and Next.js"
                            className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl font-medium text-[#171717] outline-none transition-all shadow-sm"
                            onChange={(e) => setTitle(e.target.value)} 
                            value={title}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#171717] uppercase tracking-wider ml-1">
                            Category
                        </label>
                        <select
                            className="w-full px-5 py-3.5 bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-xl font-medium cursor-pointer text-[#171717] outline-none shadow-sm"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="App Development">App Development</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="AI Tools">AI Tools</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Data Analytics">Data Analytics</option>
                            <option value="Ethical Hacking">Ethical Hacking</option>
                            <option value="UI UX Designing">UI UX Designing</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-black text-lg shadow-[0_4px_16px_rgba(91,33,182,0.25)] hover:shadow-[0_6px_22px_rgba(91,33,182,0.35)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70" 
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={24} color="white" /> : "Initialize Course"}
                        </button>
                        <p className="text-center text-[#666666] text-xs mt-4 px-4 font-medium">
                            You can add lectures, thumbnails, and pricing in the next step.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
