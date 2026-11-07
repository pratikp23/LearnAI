import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Footer = () => {
  let navigate = useNavigate();
  return (
    <footer className="w-full bg-white pt-16 pb-10 px-6 border-t border-[#EEEEF2] mt-auto">
      <div className="max-w-7xl mx-auto flex lg:items-start items-start justify-between gap-10 flex-col lg:flex-row mb-12">

        {/* Logo + Description */}
        <div className="lg:w-[35%] w-full">
          <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="h-11 w-11 rounded-2xl border-2 border-[#7C3AED] shadow-sm object-cover" />
            <span className="text-2xl font-black text-[#5B21B6] tracking-tight">
              Learn<span className="text-[#FC8019]">AI</span>
            </span>
          </div>

          <p className="text-[#666666] text-sm leading-relaxed max-w-sm font-medium">
            Next-generation learning platform designed to help you build in-demand skills. Learn smarter with curated roadmaps, AI mentors, and practice labs.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:w-[20%] w-full">
          <h3 className="text-[#171717] font-bold text-lg mb-6 relative inline-block">
            Quick Links
            <span className="absolute bottom-[-6px] left-0 w-8 h-1 bg-[#5B21B6] rounded-full"></span>
          </h3>
          <ul className="space-y-3 text-sm text-[#666666]">
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/allcourses")}>Courses</li>
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/login")}>Login</li>
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        {/* Explore Categories */}
        <div className="lg:w-[20%] w-full">
          <h3 className="text-[#171717] font-bold text-lg mb-6 relative inline-block">
            Categories
            <span className="absolute bottom-[-6px] left-0 w-8 h-1 bg-[#FC8019] rounded-full"></span>
          </h3>
          <ul className="space-y-3 text-sm text-[#666666]">
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/allcourses")}>Web Development</li>
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/allcourses")}>AI/ML</li>
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/allcourses")}>Data Science</li>
            <li className="hover:text-[#5B21B6] hover:translate-x-1 transition-all cursor-pointer block font-semibold" onClick={() => navigate("/allcourses")}>UI/UX Design</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="lg:w-[25%] w-full">
          <h3 className="text-[#171717] font-bold text-lg mb-6">Stay Updated</h3>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-[#FAFAFC] border border-[#EEEEF2] rounded-xl px-4 py-3 text-sm text-[#171717] focus:outline-none focus:border-[#7C3AED] transition-all shadow-sm" 
            />
            <button className="w-full bg-[#FC8019] hover:bg-[#E86F07] text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_rgba(252,128,25,0.25)] hover:shadow-[0_6px_20px_rgba(252,128,25,0.35)] transition-all cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#EEEEF2] pt-8 text-sm text-[#888888] font-medium flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} LearnAI. All rights reserved.</span>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-[#5B21B6] cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-[#5B21B6] cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
