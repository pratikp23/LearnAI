import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
    const items = [
        { icon: <MdCastForEducation className='w-8 h-8 text-[var(--deep-green)]' />, text: "20k+ Online Courses" },
        { icon: <SiOpenaccess className='w-8 h-8 text-[#8B6B4A]' />, text: "Lifetime Access" },
        { icon: <FaSackDollar className='w-8 h-8 text-amber-600' />, text: "Value For Money" },
        { icon: <BiSupport className='w-8 h-8 text-[var(--neon-blue)]' />, text: "Lifetime Support" },
        { icon: <FaUsers className='w-8 h-8 text-[#5C4033]' />, text: "Community Support" },
    ];

    return (
        <div className='w-full py-10 flex items-center justify-center flex-wrap gap-6 px-4'>
            {items.map((item, index) => (
                <div key={index} className='flex items-center justify-center gap-3 px-6 py-4 rounded-full glass-card hover:bg-white/90 transition-all cursor-pointer border border-[#EADBC8] shadow-sm'>
                    {item.icon}
                    <span className='text-[var(--dark-brown)] font-bold text-sm md:text-base'>{item.text}</span>
                </div>
            ))}
        </div>
    )
}

export default Logos
