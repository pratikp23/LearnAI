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
    <div className="min-h-screen w-full px-4 py-24 bg-[#FAFAFC] text-[#171717]">
      <div className="max-w-7xl mx-auto relative">
        <FaArrowLeftLong
          className="absolute -top-12 left-0 text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        />
        
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-xs font-black uppercase tracking-wider text-[#5B21B6] mb-4">
            📚 Ongoing Classes
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-4 tracking-tight">
            My <span className="text-[#5B21B6]">Learning Journey</span>
          </h1>
          <p className="text-[#666666] max-w-2xl mx-auto font-medium">Continue where you left off and master new skills with your enrolled courses.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B21B6]"></div>
          </div>
        ) : coursesToDisplay.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center max-w-md mx-auto animate-slide-up shadow-md border border-[#EEEEF2]">
            <p className="text-[#666666] mb-6 text-lg font-medium">You haven't enrolled in any courses yet.</p>
            <button 
              className="px-8 py-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
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
                className="bg-white rounded-2xl overflow-hidden group animate-slide-up border border-[#EEEEF2] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(91,33,182,0.08)] hover:-translate-y-1 transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#5B21B6] shadow-lg">
                      <FaPlay className="ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-[10px] uppercase tracking-wider text-[#5B21B6] font-black">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider">{course.level}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#171717] mb-6 line-clamp-2 h-14 group-hover:text-[#5B21B6] transition-colors">
                    {course.title}
                  </h2>
                  <button 
                    className="w-full py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
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
