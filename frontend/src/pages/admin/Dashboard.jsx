import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import img from "../../assets/empty.jpg";
import { FaArrowLeftLong, FaPlus, FaUsers, FaWallet, FaChartLine } from "react-icons/fa6";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

function Dashboard() {
  const { userData } = useSelector(state => state.user)
  const { creatorCourseData } = useSelector(state => state.course)
  const navigate = useNavigate()

  // Calculate Real Dynamic Earnings and Students
  const totalStudents = creatorCourseData?.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0) || 0;
  const totalEarnings = creatorCourseData?.reduce((acc, course) => {
    return acc + ((course.enrolledStudents?.length || 0) * (course.price || 0));
  }, 0) || 0;

  // Prepare chart data for student enrollment per course
  const enrollData = creatorCourseData?.map(c => ({
    name: c.title.length > 12 ? c.title.substring(0, 10) + '...' : c.title,
    enrolled: c.enrolledStudents?.length || 0,
    fullTitle: c.title
  })) || [];

  // Prepare chart data for lecture progress / counts
  const courseProgressData = creatorCourseData?.map(c => ({
    name: c.title.length > 12 ? c.title.substring(0, 10) + '...' : c.title,
    lectures: c.lectures?.length || 0,
    fullTitle: c.title
  })) || [];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#FAFAFC] text-[#171717]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaArrowLeftLong
            className="text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          />
          <h1 className="text-3xl font-black text-[#171717] tracking-tight">Instructor Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl flex items-center gap-5 border border-[#EEEEF2] shadow-sm">
            <div className="w-14 h-14 bg-[#F5F0FF] rounded-2xl flex items-center justify-center text-[#5B21B6] border border-[#DDD6FE]">
              <FaWallet size={24} />
            </div>
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider font-bold">Total Revenue</p>
              <h3 className="text-2xl font-black text-[#5B21B6]">₹{totalEarnings.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl flex items-center gap-5 border border-[#EEEEF2] shadow-sm">
            <div className="w-14 h-14 bg-[#FFF3E8] rounded-2xl flex items-center justify-center text-[#FC8019] border border-[#FED7AA]">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider font-bold">Total Students</p>
              <h3 className="text-2xl font-black text-[#171717]">{totalStudents}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl flex items-center gap-5 border border-[#EEEEF2] shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#16A34A] border border-emerald-200">
              <FaChartLine size={24} />
            </div>
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider font-bold">Active Courses</p>
              <h3 className="text-2xl font-black text-[#171717]">{creatorCourseData?.length || 0}</h3>
            </div>
          </div>
        </div>

        {/* Profile Summary & Action */}
        <div className="bg-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 mb-10 border border-[#EEEEF2] shadow-[0_8px_30px_rgba(91,33,182,0.06)]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-[#7C3AED] p-0.5 bg-white shadow-md">
                {userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt="Educator"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] rounded-full flex items-center justify-center text-white font-black text-2xl ${userData?.photoUrl ? 'hidden' : 'flex'}`}>
                  {userData?.name ? userData.name.slice(0, 1).toUpperCase() : "E"}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#171717]">Welcome back, {userData?.name}!</h2>
              <p className="text-[#666666] max-w-md line-clamp-1 font-medium text-sm">{userData?.description || "Manage your curriculum and track student success."}</p>
            </div>
          </div>
          <button
            className="w-full md:w-auto px-8 py-4 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(91,33,182,0.25)] cursor-pointer"
            onClick={() => navigate("/courses")}
          >
            <FaPlus /> Create New Course
          </button>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Chart */}
          <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#171717]">Student Enrollment</h3>
              <div className="px-3 py-1 bg-[#F5F0FF] text-[#5B21B6] text-xs rounded-full border border-[#DDD6FE] uppercase tracking-wider font-black">Real-time</div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEEF2" vertical={false} />
                  <XAxis dataKey="name" stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #EEEEF2', borderRadius: '12px', color: '#171717', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                  />
                  <Bar dataKey="enrolled" radius={[6, 6, 0, 0]}>
                    {enrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#5B21B6' : '#FC8019'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#171717]">Curriculum Depth</h3>
              <span className="text-xs text-[#FC8019] font-black uppercase tracking-wider">Lectures per Course</span>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEEF2" vertical={false} />
                  <XAxis dataKey="name" stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #EEEEF2', borderRadius: '12px', color: '#171717', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                  />
                  <Bar dataKey="lectures" fill="#FC8019" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
