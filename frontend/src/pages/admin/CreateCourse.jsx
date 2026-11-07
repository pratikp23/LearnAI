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
        <div className="min-h-screen flex items-center justify-center px-4 py-20 text-[var(--body-text)] font-['Outfit']">
            <div className="glass-card p-10 max-w-xl w-full relative animate-slide-up rounded-3xl border border-[var(--glass-border)] shadow-2xl">
                <FaArrowLeftLong
                    className="absolute top-8 left-8 text-2xl text-[var(--dark-brown)] hover:text-[var(--deep-green)] cursor-pointer transition-colors"
                    onClick={() => navigate("/courses")}
                />
                
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[var(--neon-blue)]/15 rounded-2xl flex items-center justify-center text-[var(--deep-green)] mb-4 border border-[var(--neon-blue)]/30 shadow-md">
                        <FaBookMedical size={30} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-center text-[var(--dark-brown)] tracking-tight">Create New Course</h2>
                    <p className="text-[var(--body-text)] text-sm mt-2 text-center opacity-85">Give your course a compelling title and category to get started.</p>
                </div>

                <form className="space-y-6" onSubmit={CreateCourseHandler}>
                    {/* Course Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--dark-brown)] uppercase tracking-wider ml-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Master React and Next.js"
                            className="w-full px-5 py-3.5 input-dark rounded-xl font-medium"
                            onChange={(e) => setTitle(e.target.value)} 
                            value={title}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--dark-brown)] uppercase tracking-wider ml-1">
                            Category
                        </label>
                        <select
                            className="w-full px-5 py-3.5 input-dark rounded-xl font-medium cursor-pointer"
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
                            className="w-full py-4 rounded-xl bg-[#3E5F44] hover:bg-[#2e4733] text-white font-extrabold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70" 
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={24} color="white" /> : "Initialize Course"}
                        </button>
                        <p className="text-center text-[var(--accent-color)] text-xs mt-4 px-4 font-medium">
                            You can add lectures, thumbnails, and pricing in the next step.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
