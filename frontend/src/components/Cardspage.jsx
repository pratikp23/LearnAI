import React, { useEffect, useState } from 'react'
import Card from "./Card.jsx"
import { useSelector } from 'react-redux';
import { SiViaplay } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

function Cardspage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const { courseData } = useSelector(state => state.course)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (courseData) {
      setPopularCourses(courseData.slice(0, 6));
    }
  }, [courseData])

  return (
    <div className='relative flex items-center justify-center flex-col py-16 w-full bg-transparent'>
      <div className="text-center mb-12 px-4">
        <h1 className='md:text-5xl text-3xl font-black text-[#171717] mb-4'>
          Our Popular Courses
        </h1>
        <p className='lg:w-2/3 md:w-4/5 mx-auto text-base md:text-lg text-[#666666] leading-relaxed font-medium'>
          Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities in tech, AI, business, and beyond.
        </p>
      </div>

      <div className='w-full max-w-7xl flex items-center justify-center flex-wrap gap-8 px-4 mb-14'>
        {popularCourses.length > 0 ? (
          popularCourses.map((item, index) => (
            <Card key={index} id={item._id} thumbnail={item.thumbnail} title={item.title} price={item.price} category={item.category} reviews={item.reviews} />
          ))
        ) : (
          <p className="text-[#666666] text-xl font-medium">Loading courses...</p>
        )}
      </div>

      <button
        className='group px-9 py-4 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-full text-base font-bold flex items-center gap-3 transition-all duration-300 shadow-[0_6px_20px_rgba(91,33,182,0.25)] hover:shadow-[0_8px_25px_rgba(91,33,182,0.35)] hover:scale-105 cursor-pointer'
        onClick={() => navigate("/allcourses")}
      >
        <span>View all Courses</span>
        <SiViaplay className='w-5 h-5 text-[#FC8019] transition-transform group-hover:scale-110' />
      </button>
    </div>
  )
}

export default Cardspage
