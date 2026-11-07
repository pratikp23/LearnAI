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
    { name: "Web Development", icon: <TbDeviceDesktopAnalytics className='w-full h-full text-[#5B21B6]' />, bg: "bg-[#F5F0FF]", border: "border-[#DDD6FE]" },
    { name: "UI/UX Design", icon: <LiaUikit className='w-full h-full text-[#7C3AED]' />, bg: "bg-[#F5F0FF]", border: "border-[#DDD6FE]" },
    { name: "App Development", icon: <MdAppShortcut className='w-full h-full text-[#FC8019]' />, bg: "bg-[#FFF3E8]", border: "border-[#FED7AA]" },
    { name: "Ethical Hacking", icon: <FaHackerrank className='w-full h-full text-[#0d9488]' />, bg: "bg-teal-50", border: "border-teal-200" },
    { name: "AI/ML", icon: <TbBrandOpenai className='w-full h-full text-[#5B21B6]' />, bg: "bg-[#F5F0FF]", border: "border-[#DDD6FE]" },
    { name: "Data Science", icon: <SiGoogledataproc className='w-full h-full text-[#FC8019]' />, bg: "bg-[#FFF3E8]", border: "border-[#FED7AA]" },
    { name: "Data Analytics", icon: <BsClipboardDataFill className='w-full h-full text-[#7C3AED]' />, bg: "bg-[#F5F0FF]", border: "border-[#DDD6FE]" },
    { name: "AI Tools", icon: <SiOpenaigym className='w-full h-full text-[#16A34A]' />, bg: "bg-emerald-50", border: "border-emerald-200" },
  ]

  return (
    <div className='w-full py-16 px-6 flex flex-col lg:flex-row items-center justify-center gap-12 bg-transparent'>
      {/* Text Section */}
      <div className='w-full lg:w-[400px] flex flex-col items-start gap-4'>
        <h2 className='text-4xl md:text-5xl font-black text-[#171717] leading-tight'>
          Explore <br />
          <span className="text-[#5B21B6]">Our Courses</span>
        </h2>
        <p className='text-[#666666] text-base md:text-lg leading-relaxed mb-6 font-medium'>
          Discover a wide range of courses designed to help you master new skills and advance your career. From coding to design, we have something for everyone.
        </p>
        <button
          className='px-8 py-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-full text-base font-bold flex items-center gap-3 transition-all duration-300 shadow-[0_4px_16px_rgba(91,33,182,0.25)] hover:shadow-[0_8px_24px_rgba(91,33,182,0.35)] hover:scale-105 cursor-pointer'
          onClick={() => navigate("/allcourses")}
        >
          <span>Explore Courses</span>
          <SiViaplay className='w-5 h-5 text-[#FC8019]' />
        </button>
      </div>

      {/* Categories Grid */}
      <div className='flex-1 flex flex-wrap justify-center gap-5 max-w-4xl'>
        {categories.map((cat, index) => (
          <div key={index} className='group w-[125px] h-[150px] flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-[#EEEEF2] hover:border-[#DDD6FE] shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(91,33,182,0.08)] cursor-pointer hover:-translate-y-1.5 transition-all'>
            <div className={`w-[64px] h-[64px] rounded-2xl flex items-center justify-center ${cat.bg} border ${cat.border} shadow-sm group-hover:scale-105 transition-all`}>
              <div className="w-[32px] h-[32px]">
                {cat.icon}
              </div>
            </div>
            <span className='text-xs font-bold text-[#171717] text-center px-1 group-hover:text-[#5B21B6] transition-colors'>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreCourses
