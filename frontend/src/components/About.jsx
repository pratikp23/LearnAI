import React from 'react'
import about from "../assets/about.jpg"
import VideoPlayer from './VideoPlayer'
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck } from "react-icons/bi";

function About() {
  return (
    <div className='w-full lg:min-h-[70vh] py-16 flex flex-wrap items-center justify-center gap-12 bg-transparent'>
      <div className='lg:w-[45%] md:w-[80%] w-[95%] h-full flex items-center justify-center relative group'>
        <div className="absolute inset-0 bg-gradient-to-r from-[#5B21B6]/15 to-[#FC8019]/15 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
        <img src={about} className='w-[90%] rounded-2xl shadow-xl relative z-10 border border-[#EEEEF2]' alt="About Us" />
        <div className="absolute bottom-10 right-10 z-20">
          <VideoPlayer />
        </div>
      </div>

      <div className='lg:w-[45%] md:w-[80%] w-[95%] flex flex-col items-start justify-center p-6'>
        <div className='flex items-center gap-3 text-[#FC8019] text-sm font-black tracking-widest uppercase mb-3'>
          <span>About Us</span>
          <TfiLayoutLineSolid className='w-6 h-6' />
        </div>

        <h2 className='text-4xl md:text-5xl font-black text-[#171717] mb-6 leading-tight'>
          Maximize Your <br />
          <span className="text-[#5B21B6]">Learning Growth</span>
        </h2>

        <p className='text-[#666666] text-base md:text-lg mb-8 leading-relaxed font-medium'>
          We provide a modern Learning Management System to simplify online education, track progress, and enhance student-instructor collaboration efficiently. Experience the future of learning with our cutting-edge platform.
        </p>

        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[
            "Simplified Learning",
            "Expert Trainers",
            "Real-World Projects",
            "Lifetime Access"
          ].map((item, index) => (
            <div key={index} className='flex items-center gap-3 text-[#171717] text-sm md:text-base font-bold bg-white border border-[#EEEEF2] p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DDD6FE] transition-all'>
              <BiSolidBadgeCheck className='w-6 h-6 text-[#16A34A]' />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
