import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FiMap, FiTerminal, FiCalendar, FiMessageSquare, FiTrendingUp, FiCpu } from "react-icons/fi";
import DotGridBackground from "../components/DotGridBackground";

const AIHub = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "AI Roadmap Generator",
      description: "Generate personalized learning paths for any topic or career track.",
      icon: <FiMap size={24} />,
      path: "/roadmap",
      gradient: "from-[#5B21B6] to-[#7C3AED]",
      status: "Available"
    },
    {
      title: "AI Interview Simulator",
      description: "Practice technical interviews with real-time speech recognition and scoring.",
      icon: <FiTerminal size={24} />,
      path: "/interview-simulator",
      gradient: "from-[#FC8019] to-[#F97316]",
      status: "Available"
    },
    {
      title: "AI Study Planner",
      description: "Create an adaptive daily schedule to master your target milestones.",
      icon: <FiCalendar size={24} />,
      path: "/study-planner",
      gradient: "from-[#7C3AED] to-[#A855F7]",
      status: "Available"
    },
    {
      title: "AI Quiz Generator",
      description: "Generate instant interactive MCQ assessments to test your comprehension.",
      icon: <FiMessageSquare size={24} />,
      path: "/quiz",
      gradient: "from-[#16A34A] to-[#22C55E]",
      status: "Available"
    },
    {
      title: "Mistakes Engine",
      description: "Track problem areas and receive targeted reinforcement revision steps.",
      icon: <FiTrendingUp size={24} />,
      path: "/error-tracker",
      gradient: "from-[#FC8019] to-[#FB923C]",
      status: "Available"
    },
    {
      title: "AI Resume Analyzer",
      description: "Scan your resume against job specifications to optimize your ATS score.",
      icon: <FiMap size={24} />,
      path: "/resume-analyzer",
      gradient: "from-[#5B21B6] to-[#6366F1]",
      status: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717]">
      <Nav />
      
      <div className="pt-32 pb-24 px-6 relative overflow-hidden">
        <DotGridBackground className="text-[#7C3AED]/20" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-xs font-black uppercase tracking-wider text-[#5B21B6] mb-4">
              ✨ AI Learning Suite
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-[#171717]">
              Student AI Hub
            </h1>
            <p className="text-[#666666] text-base md:text-lg font-medium leading-relaxed">
              Supercharge your learning journey with our suite of modern AI-powered educational tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                onClick={() => tool.status === "Available" && navigate(tool.path)}
                className={`group relative bg-white p-8 rounded-3xl border border-[#EEEEF2] hover:border-[#DDD6FE] transition-all cursor-pointer overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(91,33,182,0.08)] hover:-translate-y-1 flex flex-col justify-between ${tool.status !== "Available" && "opacity-60 grayscale cursor-not-allowed"}`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center text-white mb-6 shadow-md`}>
                    {tool.icon}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-[#171717] group-hover:text-[#5B21B6] transition-colors">{tool.title}</h3>
                    {tool.status === "Soon" && (
                      <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-bold">Coming Soon</span>
                    )}
                  </div>
                  
                  <p className="text-[#666666] leading-relaxed font-medium mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EEEEF2] flex items-center text-sm font-bold text-[#5B21B6] group-hover:text-[#FC8019] transition-all">
                  <span>
                    {tool.status === "Available" ? "Launch Tool →" : "Unlock Soon"}
                  </span>
                  <FiCpu className="opacity-0 group-hover:opacity-100 transition-opacity ml-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIHub;
