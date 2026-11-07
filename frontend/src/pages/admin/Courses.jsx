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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 bg-[#FAFAFC] text-[#171717]">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <FaArrowLeftLong
              className="text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
              onClick={() => navigate("/dashboard")}
            />
            <h1 className="text-3xl font-black text-[#171717] tracking-tight">Your Courses</h1>
          </div>

          <button
            className="w-full sm:w-auto px-6 py-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(91,33,182,0.25)] cursor-pointer"
            onClick={() => navigate("/createcourses")}
          >
            <FaPlus /> Create Course
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} color="#5B21B6" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl overflow-hidden border border-[#EEEEF2] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFAFC] border-b border-[#EEEEF2]">
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-black text-[#5B21B6]">Course Detail</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-black text-[#5B21B6] text-center">Price</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-black text-[#5B21B6] text-center">Status</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-wider font-black text-[#5B21B6] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEEF2]">
                    {creatorCourseData?.map((course, index) => (
                      <tr key={index} className="group hover:bg-[#FAFAFC] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={course?.thumbnail || img1}
                                alt={course?.title}
                                className="relative w-20 h-12 object-cover rounded-xl border border-[#EEEEF2] shadow-sm"
                              />
                            </div>
                            <span className="font-bold text-[#171717] group-hover:text-[#5B21B6] transition-colors line-clamp-1 max-w-[300px]">
                              {course?.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-[#5B21B6] font-black">
                            {course?.price ? `₹${course?.price}` : <span className="text-gray-400 italic">Unset</span>}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            course?.isPublished 
                              ? "bg-emerald-50 text-[#16A34A] border border-emerald-200" 
                              : "bg-[#FFF3E8] text-[#FC8019] border border-[#FED7AA]"
                          }`}>
                            {course?.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            className="p-3 bg-[#F5F0FF] hover:bg-[#5B21B6] text-[#5B21B6] hover:text-white border border-[#DDD6FE] rounded-xl transition-all active:scale-90 cursor-pointer shadow-sm"
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
                <div className="py-20 text-center text-[#666666] font-medium">
                  No courses found. Start by creating your first course!
                </div>
              )}
              <div className="bg-[#FAFAFC] py-4 px-6 border-t border-[#EEEEF2]">
                <p className="text-xs text-[#666666] text-center uppercase tracking-wider font-bold">
                  A list of your managed courses
                </p>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {creatorCourseData?.map((course, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-[#EEEEF2] flex flex-col gap-4 shadow-sm">
                  <div className="flex gap-4 items-center">
                    <img
                      src={course?.thumbnail || img1}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover border border-[#EEEEF2] shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-[#171717] truncate text-lg">
                        {course?.title}
                      </h2>
                      <p className="text-[#5B21B6] font-black text-sm mt-1">
                        {course?.price ? `₹${course?.price}` : "Price Unset"}
                      </p>
                    </div>
                    <button
                      className="p-3 bg-[#F5F0FF] border border-[#DDD6FE] text-[#5B21B6] rounded-xl active:scale-90 cursor-pointer shadow-sm"
                      onClick={() => navigate(`/addcourses/${course?._id}`)}
                    >
                      <FaRegPenToSquare size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#EEEEF2]">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      course?.isPublished 
                        ? "bg-emerald-50 text-[#16A34A] border border-emerald-200" 
                        : "bg-[#FFF3E8] text-[#FC8019] border border-[#FED7AA]"
                    }`}>
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
              {(!creatorCourseData || creatorCourseData.length === 0) && (
                <p className="text-center text-[#666666] py-10 font-medium">No courses found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
