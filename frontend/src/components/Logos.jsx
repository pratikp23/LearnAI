import React from 'react';
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar, FaStar, FaUsers, FaArrowTrendUp } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";

function Logos() {
    const items = [
        { icon: <MdCastForEducation className='w-6 h-6 text-[#5B21B6]' />, text: "20k+ Online Courses" },
        { icon: <FaStar className='w-5 h-5 text-[#FC8019]' />, text: "4.9 ★ Average Rating" },
        { icon: <SiOpenaccess className='w-6 h-6 text-[#5B21B6]' />, text: "Lifetime Access" },
        { icon: <FaSackDollar className='w-5 h-5 text-[#16A34A]' />, text: "Value For Money" },
        { icon: <FaArrowTrendUp className='w-5 h-5 text-[#16A34A]' />, text: "96% Career Success" },
        { icon: <BiSupport className='w-6 h-6 text-[#7C3AED]' />, text: "24/7 Support" },
        { icon: <FaUsers className='w-6 h-6 text-[#FC8019]' />, text: "Community Access" },
    ];

    return (
        <div className='w-full py-10 flex items-center justify-center flex-wrap gap-4 sm:gap-5 px-4'>
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className='flex items-center justify-center gap-3 px-5 sm:px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F0FF]/50 transition-all cursor-pointer border border-[#EEEEF2] hover:border-[#DDD6FE] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_18px_rgba(91,33,182,0.08)] hover:-translate-y-0.5'
                >
                    {item.icon}
                    <span className='text-[#171717] font-bold text-sm md:text-base'>{item.text}</span>
                </div>
            ))}
        </div>
    );
}

export default Logos;
