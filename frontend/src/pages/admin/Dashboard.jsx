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
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 text-[var(--body-text)] font-['Outfit']">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaArrowLeftLong
            className="text-2xl text-[var(--dark-brown)] hover:text-[var(--deep-green)] cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          />
          <h1 className="text-3xl font-extrabold text-[var(--dark-brown)] tracking-tight">Instructor Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-5 border border-[var(--glass-border)] shadow-md">
            <div className="w-14 h-14 bg-[var(--neon-blue)]/15 rounded-2xl flex items-center justify-center text-[var(--deep-green)] border border-[var(--neon-blue)]/30">
              <FaWallet size={24} />
            </div>
            <div>
              <p className="text-xs text-[var(--accent-color)] uppercase tracking-wider font-bold">Total Revenue</p>
              <h3 className="text-2xl font-black text-[var(--deep-green)]">₹{totalEarnings.toLocaleString()}</h3>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-5 border border-[var(--glass-border)] shadow-md">
            <div className="w-14 h-14 bg-blue-500/15 rounded-2xl flex items-center justify-center text-blue-700 border border-blue-500/30">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="text-xs text-[var(--accent-color)] uppercase tracking-wider font-bold">Total Students</p>
              <h3 className="text-2xl font-black text-[var(--dark-brown)]">{totalStudents}</h3>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-5 border border-[var(--glass-border)] shadow-md">
            <div className="w-14 h-14 bg-amber-500/15 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-500/30">
              <FaChartLine size={24} />
            </div>
            <div>
              <p className="text-xs text-[var(--accent-color)] uppercase tracking-wider font-bold">Active Courses</p>
              <h3 className="text-2xl font-black text-[var(--dark-brown)]">{creatorCourseData?.length || 0}</h3>
            </div>
          </div>
        </div>

        {/* Profile Summary & Action */}
        <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 mb-10 border border-[var(--glass-border)] shadow-xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-[var(--neon-blue)] p-0.5 bg-white shadow-md">
                {userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt="Educator"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : null}
                <div className={`w-full h-full bg-[#3E5F44] rounded-full flex items-center justify-center text-white font-bold text-2xl ${userData?.photoUrl ? 'hidden' : 'flex'}`}>
                  {userData?.name ? userData.name.slice(0, 1).toUpperCase() : "E"}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[var(--dark-brown)]">Welcome back, {userData?.name}!</h2>
              <p className="text-[var(--body-text)] max-w-md line-clamp-1 opacity-85 text-sm">{userData?.description || "Manage your curriculum and track student success."}</p>
            </div>
          </div>
          <button
            className="w-full md:w-auto px-8 py-4 bg-[#3E5F44] hover:bg-[#2e4733] text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            onClick={() => navigate("/courses")}
          >
            <FaPlus /> Create New Course
          </button>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Chart */}
          <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] shadow-md">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[var(--dark-brown)]">Student Enrollment</h3>
              <div className="px-3 py-1 bg-[var(--neon-blue)]/15 text-[var(--deep-green)] text-xs rounded-full border border-[var(--neon-blue)]/30 uppercase tracking-wider font-bold">Real-time</div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #ccc', borderRadius: '12px', color: '#1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="enrolled" radius={[6, 6, 0, 0]}>
                    {enrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3E5F44' : '#5F8D4E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] shadow-md">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[var(--dark-brown)]">Curriculum Depth</h3>
              <span className="text-xs text-[var(--accent-color)] font-bold uppercase tracking-wider">Lectures per Course</span>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #ccc', borderRadius: '12px', color: '#1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="lectures" fill="#5F8D4E" radius={[6, 6, 0, 0]} />
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
