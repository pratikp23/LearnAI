import React from 'react'
import about from "../assets/about.jpg"
import VideoPlayer from './VideoPlayer'
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck } from "react-icons/bi";

function About() {
  return (
    <div className='w-full lg:min-h-[70vh] py-16 flex flex-wrap items-center justify-center gap-12 bg-transparent'>
      <div className='lg:w-[45%] md:w-[80%] w-[95%] h-full flex items-center justify-center relative group'>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--deep-green)] to-[var(--neon-purple)] rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-500"></div>
        <img src={about} className='w-[90%] rounded-2xl shadow-xl relative z-10 border border-[var(--glass-border)]' alt="About Us" />
        <div className="absolute bottom-10 right-10 z-20">
          <VideoPlayer />
        </div>
      </div>

      <div className='lg:w-[45%] md:w-[80%] w-[95%] flex flex-col items-start justify-center p-6'>
        <div className='flex items-center gap-4 text-[var(--deep-green)] text-xl font-bold tracking-wide mb-4'>
          <span className="uppercase">About Us</span>
          <TfiLayoutLineSolid className='w-8 h-8' />
        </div>

        <h2 className='text-4xl md:text-5xl font-extrabold text-[var(--dark-brown)] mb-6 leading-tight'>
          Maximize Your <br />
          <span className="text-gradient">Learning Growth</span>
        </h2>

        <p className='text-[var(--body-text)] text-lg mb-8 leading-relaxed opacity-85'>
          We provide a modern Learning Management System to simplify online education, track progress, and enhance student-instructor collaboration efficiently. Experience the future of learning with our cutting-edge platform.
        </p>

        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[
            "Simplified Learning",
            "Expert Trainers",
            "Big Experience",
            "Lifetime Access"
          ].map((item, index) => (
            <div key={index} className='flex items-center gap-3 text-[var(--dark-brown)] text-base font-bold bg-white/75 border border-[var(--glass-border)] p-3.5 rounded-xl shadow-sm'>
              <BiSolidBadgeCheck className='w-6 h-6 text-[var(--deep-green)]' />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
