import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Footer = () => {
  let navigate = useNavigate();
  return (
    <footer className="w-full bg-[var(--secondary-bg)] backdrop-blur-md pt-16 pb-8 px-6 border-t border-[var(--glass-border)] mt-auto">
      <div className="max-w-7xl mx-auto flex lg:items-start items-start justify-between gap-10 flex-col lg:flex-row mb-12">

        {/* Logo + Description */}
        <div className="lg:w-[35%] w-full">
          <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="h-12 w-12 rounded-full border-2 border-[var(--neon-blue)] shadow-md" />
            <span className="text-2xl font-extrabold text-[var(--dark-brown)] tracking-wide">Learn<span className="text-[var(--deep-green)]">AI</span></span>
          </div>

          <p className="text-[var(--body-text)] text-sm leading-relaxed max-w-sm opacity-85">
            AI-powered learning platform to help you grow smarter. Unlock your potential with our premium courses and expert community. Learn anything, anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:w-[20%] w-full">
          <h3 className="text-[var(--dark-brown)] font-bold text-lg mb-6 relative inline-block">
            Quick Links
            <span className="absolute bottom-[-5px] left-0 w-1/2 h-1 bg-[var(--deep-green)] rounded-full"></span>
          </h3>
          <ul className="space-y-3 text-sm text-[var(--body-text)]">
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/allcourses")}>Courses</li>
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/login")}>Login</li>
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        {/* Explore Categories */}
        <div className="lg:w-[20%] w-full">
          <h3 className="text-[var(--dark-brown)] font-bold text-lg mb-6 relative inline-block">
            Categories
            <span className="absolute bottom-[-5px] left-0 w-1/2 h-1 bg-[var(--neon-blue)] rounded-full"></span>
          </h3>
          <ul className="space-y-3 text-sm text-[var(--body-text)]">
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/allcourses")}>Web Development</li>
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/allcourses")}>AI/ML</li>
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/allcourses")}>Data Science</li>
            <li className="hover:text-[var(--deep-green)] hover:translate-x-1 transition-all cursor-pointer block font-medium" onClick={() => navigate("/allcourses")}>UI/UX Design</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="lg:w-[25%] w-full">
          <h3 className="text-[var(--dark-brown)] font-bold text-lg mb-6">Stay Updated</h3>
          <div className="flex flex-col gap-3">
            <input type="email" placeholder="Enter your email" className="w-full bg-white/90 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[var(--neon-blue)] transition-colors shadow-sm" />
            <button className="w-full bg-[#3E5F44] hover:bg-[#2e4733] text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--glass-border)] pt-8 text-sm text-center text-[var(--accent-color)] font-medium flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} LearnAI. All rights reserved.</span>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-[var(--deep-green)] cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-[var(--deep-green)] cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
