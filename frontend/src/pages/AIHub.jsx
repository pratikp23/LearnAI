import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FiMap, FiTerminal, FiCalendar, FiMessageSquare, FiTrendingUp, FiCpu } from "react-icons/fi";

const AIHub = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "AI Roadmap Generator",
      description: "Generate personalized learning paths for any topic.",
      icon: <FiMap size={24} />,
      path: "/roadmap",
      color: "from-blue-500 to-cyan-400",
      status: "Available"
    },
    {
      title: "AI Interview Simulator",
      description: "Practice technical interviews with real-time feedback and scoring.",
      icon: <FiTerminal size={24} />,
      path: "/interview-simulator",
      color: "from-purple-500 to-pink-500",
      status: "Available"
    },
    {
      title: "AI Study Planner",
      description: "Create a daily schedule to reach your learning goals.",
      icon: <FiCalendar size={24} />,
      path: "/study-planner",
      color: "from-orange-500 to-red-500",
      status: "Available"
    },
    {
      title: "AI Quiz Generator",
      description: "Notes/PDF upload → automatic MCQ test generate.",
      icon: <FiMessageSquare size={24} />,
      path: "/quiz",
      color: "from-green-500 to-emerald-400",
      status: "Available"
    },
    {
      title: "Mistakes Engine",
      description: "Track your mistakes and get personalized revision plans.",
      icon: <FiTrendingUp size={24} />,
      path: "/error-tracker",
      color: "from-yellow-400 to-orange-400",
      status: "Available"
    },
    {
      title: "AI Resume Analyzer",
      description: "Paste your resume and job description to get an ATS score and feedback.",
      icon: <FiMap size={24} />,
      path: "/resume-analyzer",
      color: "from-blue-400 to-indigo-500",
      status: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--body-text)] font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-14">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-[var(--dark-brown)]">
              Student AI Hub
            </h1>
            <p className="text-[var(--body-text)] text-lg opacity-85">
              Supercharge your learning journey with our suite of AI-powered educational tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                onClick={() => tool.status === "Available" && navigate(tool.path)}
                className={`group relative glass-card p-8 rounded-3xl border border-[var(--glass-border)] hover:border-[var(--neon-blue)]/50 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-xl ${tool.status !== "Available" && "opacity-60 grayscale cursor-not-allowed"}`}
              >
                {/* Background Glow */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${tool.color} blur-[80px] opacity-15 group-hover:opacity-30 transition-opacity`}></div>
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-6 shadow-md`}>
                  {tool.icon}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-[var(--dark-brown)] group-hover:text-[var(--deep-green)] transition-colors">{tool.title}</h3>
                  {tool.status === "Soon" && (
                    <span className="text-[10px] uppercase tracking-widest bg-[var(--secondary-bg)] text-[var(--dark-brown)] px-2.5 py-1 rounded-md font-bold border border-[var(--glass-border)]">Coming Soon</span>
                  )}
                </div>
                
                <p className="text-[var(--body-text)] leading-relaxed opacity-85 mb-6">
                  {tool.description}
                </p>

                <div className="mt-auto flex items-center text-sm font-bold group-hover:gap-2 transition-all text-[var(--deep-green)]">
                  <span>
                    {tool.status === "Available" ? "Launch Tool ?" : "Unlock Soon"}
                  </span>
                  <FiCpu className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
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
