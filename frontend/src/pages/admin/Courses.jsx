import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong, FaPlus, FaRegPenToSquare } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import img1 from "../../assets/empty.jpg";
import axios from 'axios';
import { serverUrl } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatorCourseData } from '../../redux/courseSlice';
import { ClipLoader } from 'react-spinners';

function Courses() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { creatorCourseData } = useSelector(state => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getCreatorData = async () => {
      setLoading(true)
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
        dispatch(setCreatorCourseData(result.data))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getCreatorData()
  }, [dispatch])

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 text-[var(--body-text)] font-['Outfit']">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <FaArrowLeftLong
              className="text-2xl text-[var(--dark-brown)] hover:text-[var(--deep-green)] cursor-pointer transition-colors"
              onClick={() => navigate("/dashboard")}
            />
            <h1 className="text-3xl font-extrabold text-[var(--dark-brown)] tracking-tight">Your Courses</h1>
          </div>

          <button
            className="w-full sm:w-auto px-6 py-3.5 bg-[#3E5F44] hover:bg-[#2e4733] text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            onClick={() => navigate("/createcourses")}
          >
            <FaPlus /> Create Course
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} color="var(--deep-green)" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block glass-card rounded-3xl overflow-hidden border border-[var(--glass-border)] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/80 border-b border-[var(--glass-border)]">
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-bold text-[var(--accent-color)]">Course Detail</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-bold text-[var(--accent-color)] text-center">Price</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-bold text-[var(--accent-color)] text-center">Status</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-bold text-[var(--accent-color)] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--glass-border)]">
                    {creatorCourseData?.map((course, index) => (
                      <tr key={index} className="group hover:bg-white/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={course?.thumbnail || img1}
                                alt={course?.title}
                                className="relative w-20 h-12 object-cover rounded-lg border border-[var(--glass-border)] shadow-sm"
                              />
                            </div>
                            <span className="font-bold text-[var(--dark-brown)] group-hover:text-[var(--deep-green)] transition-colors line-clamp-1 max-w-[300px]">
                              {course?.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-[var(--deep-green)] font-extrabold">
                            {course?.price ? `₹${course?.price}` : <span className="text-gray-400 italic">Unset</span>}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            course?.isPublished 
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}>
                            {course?.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            className="p-3 bg-white/80 border border-[var(--glass-border)] rounded-xl text-[var(--dark-brown)] hover:text-white hover:bg-[var(--deep-green)] transition-all active:scale-90 cursor-pointer shadow-sm"
                            onClick={() => navigate(`/addcourses/${course?._id}`)}
                            title="Edit Course"
                          >
                            <FaRegPenToSquare size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(!creatorCourseData || creatorCourseData.length === 0) && (
                <div className="py-20 text-center text-[var(--dark-brown)] font-medium">
                  No courses found. Start by creating your first course!
                </div>
              )}
              <div className="bg-white/60 py-4 px-6 border-t border-[var(--glass-border)]">
                <p className="text-xs text-[var(--accent-color)] text-center uppercase tracking-widest font-semibold">
                  A list of your managed courses
                </p>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {creatorCourseData?.map((course, index) => (
                <div key={index} className="glass-card p-5 rounded-2xl border border-[var(--glass-border)] flex flex-col gap-4 shadow-md">
                  <div className="flex gap-4 items-center">
                    <img
                      src={course?.thumbnail || img1}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover border border-[var(--glass-border)] shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-[var(--dark-brown)] truncate text-lg">
                        {course?.title}
                      </h2>
                      <p className="text-[var(--deep-green)] font-extrabold text-sm mt-1">
                        {course?.price ? `₹${course?.price}` : "Price Unset"}
                      </p>
                    </div>
                    <button
                      className="p-3 bg-white border border-[var(--glass-border)] text-[var(--dark-brown)] hover:text-[var(--deep-green)] rounded-xl active:scale-90 cursor-pointer shadow-sm"
                      onClick={() => navigate(`/addcourses/${course?._id}`)}
                    >
                      <FaRegPenToSquare size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-[var(--glass-border)]">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      course?.isPublished 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
              {(!creatorCourseData || creatorCourseData.length === 0) && (
                <p className="text-center text-gray-500 py-10 font-medium">No courses found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
