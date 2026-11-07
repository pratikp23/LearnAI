import React from 'react'
import { SiViaplay, SiGoogledataproc, SiOpenaigym } from "react-icons/si";
import { TbDeviceDesktopAnalytics, TbBrandOpenai } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { BsClipboardDataFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

function ExploreCourses() {
  const navigate = useNavigate()

  const categories = [
    { name: "Web Development", icon: <TbDeviceDesktopAnalytics className='w-full h-full text-[var(--neon-blue)]' />, color: "border-[var(--neon-blue)]" },
    { name: "UI/UX Design", icon: <LiaUikit className='w-full h-full text-[#c026d3]' />, color: "border-[#c026d3]" },
    { name: "App Development", icon: <MdAppShortcut className='w-full h-full text-[#7c3aed]' />, color: "border-[#7c3aed]" },
    { name: "Ethical Hacking", icon: <FaHackerrank className='w-full h-full text-[#0d9488]' />, color: "border-[#0d9488]" },
    { name: "AI/ML", icon: <TbBrandOpenai className='w-full h-full text-[#e11d48]' />, color: "border-[#e11d48]" },
    { name: "Data Science", icon: <SiGoogledataproc className='w-full h-full text-[#2563eb]' />, color: "border-[#2563eb]" },
    { name: "Data Analytics", icon: <BsClipboardDataFill className='w-full h-full text-[#d97706]' />, color: "border-[#d97706]" },
    { name: "AI Tools", icon: <SiOpenaigym className='w-full h-full text-[#059669]' />, color: "border-[#059669]" },
  ]

  return (
    <div className='w-full py-16 px-6 flex flex-col lg:flex-row items-center justify-center gap-12 bg-transparent'>
      {/* Text Section */}
      <div className='w-full lg:w-[400px] flex flex-col items-start gap-4'>
        <h2 className='text-4xl md:text-5xl font-extrabold text-[var(--dark-brown)] leading-tight'>
          Explore <br />
          <span className="text-gradient">Our Courses</span>
        </h2>
        <p className='text-[var(--body-text)] text-lg leading-relaxed mb-6 opacity-85'>
          Discover a wide range of courses designed to help you master new skills and advance your career. From coding to design, we have something for everyone.
        </p>
        <button
          className='px-8 py-3.5 bg-[#3E5F44] hover:bg-[#2e4733] text-white rounded-full text-base font-bold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer'
          onClick={() => navigate("/allcourses")}
        >
          <span>Explore Courses</span>
          <SiViaplay className='w-5 h-5' />
        </button>
      </div>

      {/* Categories Grid */}
      <div className='flex-1 flex flex-wrap justify-center gap-5 max-w-4xl'>
        {categories.map((cat, index) => (
          <div key={index} className='group w-[125px] h-[150px] flex flex-col items-center justify-center gap-3 glass-card rounded-2xl cursor-pointer hover:-translate-y-1.5 transition-all'>
            <div className={`w-[65px] h-[65px] rounded-xl flex items-center justify-center bg-white/70 border-2 ${cat.color} shadow-sm group-hover:scale-105 transition-all`}>
              <div className="w-[36px] h-[36px]">
                {cat.icon}
              </div>
            </div>
            <span className='text-xs font-bold text-[var(--dark-brown)] text-center px-1 group-hover:text-[var(--deep-green)] transition-colors'>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreCourses
