import React from 'react';
import { FaCompass, FaVideo, FaTrophy } from 'react-icons/fa6';

const steps = [
  {
    step: "01",
    title: "Tell AI What You Want to Master",
    desc: "Speak into AI Search or choose your track. LearnAI automatically curates industry courses and drafts your personalized learning roadmap.",
    icon: <FaCompass className="w-6 h-6 text-[#5B21B6]" />,
    bg: "bg-[#F5F0FF]",
    border: "border-[#7C3AED]/20",
    pill: "Smart Discovery"
  },
  {
    step: "02",
    title: "Learn with HD Video Curriculums",
    desc: "Follow structured video modules taught by industry practitioners. Access free preview lessons anytime to test the waters before enrolling.",
    icon: <FaVideo className="w-6 h-6 text-[#FC8019]" />,
    bg: "bg-[#FFF3E8]",
    border: "border-[#FC8019]/25",
    pill: "Self-Paced Mastery"
  },
  {
    step: "03",
    title: "Simulate, Polish & Get Job-Ready",
    desc: "Practice realistic voice interviews with speech AI, benchmark your resume against ATS criteria, and test your retention with quizzes.",
    icon: <FaTrophy className="w-6 h-6 text-[#16A34A]" />,
    bg: "bg-green-50",
    border: "border-green-200",
    pill: "Career Advancement"
  }
];

function HowItWorks() {
  return (
    <section className="w-full py-16 px-4 sm:px-8 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF3E8] border border-[#FED7AA] text-xs font-black uppercase tracking-wider text-[#FC8019] mb-3 shadow-sm">
            ⚡ Quick & Effortless
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171717] tracking-tight">
            How <span className="text-[#5B21B6]">LearnAI</span> Accelerates Your Career
          </h2>
          <p className="text-[#666666] text-sm sm:text-base max-w-xl mx-auto mt-3 font-medium">
            From discovering your path to clearing the interview—our platform guides every single step.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-8 border border-[#EEEEF2] shadow-[0_6px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_35px_rgba(91,33,182,0.07)] transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.border} border flex items-center justify-center shadow-sm`}>
                    {s.icon}
                  </div>
                  <span className="text-3xl font-black text-[#EEEEF2] group-hover:text-[#DDD6FE] transition-colors">
                    {s.step}
                  </span>
                </div>

                {/* Pill */}
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#5B21B6] bg-[#F5F0FF] px-2.5 py-0.5 rounded-md border border-[#DDD6FE] mb-3">
                  {s.pill}
                </span>

                {/* Title */}
                <h3 className="text-xl font-black text-[#171717] mb-3 leading-snug">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-[#666666] text-sm leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
