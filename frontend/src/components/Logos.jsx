import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
    const items = [
        { icon: <MdCastForEducation className='w-7 h-7 text-[#5B21B6]' />, text: "20k+ Online Courses" },
        { icon: <SiOpenaccess className='w-7 h-7 text-[#FC8019]' />, text: "Lifetime Access" },
        { icon: <FaSackDollar className='w-7 h-7 text-[#16A34A]' />, text: "Value For Money" },
        { icon: <BiSupport className='w-7 h-7 text-[#7C3AED]' />, text: "24/7 Support" },
        { icon: <FaUsers className='w-7 h-7 text-[#FC8019]' />, text: "Community Access" },
    ];

    return (
        <div className='w-full py-10 flex items-center justify-center flex-wrap gap-5 px-4'>
            {items.map((item, index) => (
                <div key={index} className='flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F0FF]/50 transition-all cursor-pointer border border-[#EEEEF2] hover:border-[#DDD6FE] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_18px_rgba(91,33,182,0.08)]'>
                    {item.icon}
                    <span className='text-[#171717] font-bold text-sm md:text-base'>{item.text}</span>
                </div>
            ))}
        </div>
    )
}

export default Logos
