import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong, FaPlay } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';

function EnrolledCourse() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getusercourses", { withCredentials: true })
        setEnrolledCourses(result.data.enrolledCourses || [])
      } catch (error) {
        console.error("Error fetching enrolled courses", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEnrolledCourses()
  }, [])

  const coursesToDisplay = enrolledCourses.length > 0 ? enrolledCourses : userData?.enrolledCourses || [];

  return (
    <div className="min-h-screen w-full px-4 py-24 text-[var(--body-text)] font-['Outfit']">
      <div className="max-w-7xl mx-auto relative">
        <FaArrowLeftLong
          className="absolute -top-12 left-0 text-2xl text-[var(--dark-brown)] hover:text-[var(--deep-green)] cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        />
        
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--dark-brown)] mb-4 tracking-tight">
            My <span className="text-gradient">Learning Journey</span>
          </h1>
          <p className="text-[var(--body-text)] max-w-2xl mx-auto opacity-85">Continue where you left off and master new skills with your enrolled courses.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--deep-green)]"></div>
          </div>
        ) : coursesToDisplay.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto animate-slide-up shadow-xl">
            <p className="text-[var(--body-text)] mb-6 text-lg font-medium opacity-85">You haven't enrolled in any courses yet.</p>
            <button 
              className="px-8 py-3.5 bg-[#3E5F44] hover:bg-[#2e4733] text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
              onClick={() => navigate("/allcourses")}
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coursesToDisplay.map((course, index) => (
              <div
                key={course._id}
                className="glass-card rounded-2xl overflow-hidden group animate-slide-up border border-[var(--glass-border)] shadow-md hover:shadow-xl transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden bg-black/10">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--deep-green)] shadow-lg">
                      <FaPlay className="ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[var(--neon-blue)]/15 border border-[var(--neon-blue)]/30 text-[10px] uppercase tracking-wider text-[var(--deep-green)] font-bold">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-[var(--accent-color)] font-bold uppercase tracking-widest">{course.level}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--dark-brown)] mb-6 line-clamp-2 h-14 group-hover:text-[var(--deep-green)] transition-colors">
                    {course.title}
                  </h2>
                  <button 
                    className="w-full py-3 bg-[#3E5F44] hover:bg-[#2e4733] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                  >
                    Resume Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse
