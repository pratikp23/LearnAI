import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { 
  FiMap, 
  FiTerminal, 
  FiCalendar, 
  FiMessageSquare, 
  FiTrendingUp, 
  FiCpu, 
  FiSend, 
  FiCopy, 
  FiCheck, 
  FiZap,
  FiFileText
} from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import DotGridBackground from "../components/DotGridBackground";

const AIHub = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  const samplePrompts = [
    "Explain React useEffect hook with a simple code example",
    "How does JWT token authentication work in full-stack apps?",
    "What is the difference between SQL and NoSQL databases?",
    "Give me 5 essential tips to crack a frontend developer interview"
  ];

  const handleAskAI = async (e, promptText = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalQuery = (promptText || query).trim();
    if (!finalQuery) {
      return toast.error("Please enter a question or topic for the AI.");
    }

    setQuery(finalQuery);
    setLoading(true);
    setResponse("");

    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/ask`, { query: finalQuery });
      setResponse(data.answer || "I have analyzed your query, but could not produce a response. Please try rephrasing.");
      toast.success("AI response ready!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "AI failed to respond. Please check your API key on Render or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success("Response copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    {
      title: "AI Roadmap Generator",
      description: "Generate structured, phased learning curriculums for any technology or career track.",
      icon: <FiMap size={24} />,
      path: "/roadmap",
      gradient: "from-[#5B21B6] to-[#7C3AED]",
      status: "Available"
    },
    {
      title: "AI Interview Simulator",
      description: "Simulate realistic technical interviews with real-time speech recognition and scoring.",
      icon: <FiTerminal size={24} />,
      path: "/interview-simulator",
      gradient: "from-[#FC8019] to-[#F97316]",
      status: "Available"
    },
    {
      title: "AI Study Planner",
      description: "Create an adaptive daily schedule to master target milestones in your chosen timeline.",
      icon: <FiCalendar size={24} />,
      path: "/study-planner",
      gradient: "from-[#7C3AED] to-[#A855F7]",
      status: "Available"
    },
    {
      title: "AI Quiz Generator",
      description: "Generate instant interactive assessments with explanations to test your comprehension.",
      icon: <FiMessageSquare size={24} />,
      path: "/quiz",
      gradient: "from-[#16A34A] to-[#22C55E]",
      status: "Available"
    },
    {
      title: "Mistakes Engine",
      description: "Identify recurrent gaps in your quizzes and receive a personalized 3-step revision plan.",
      icon: <FiTrendingUp size={24} />,
      path: "/error-tracker",
      gradient: "from-[#FC8019] to-[#FB923C]",
      status: "Available"
    },
    {
      title: "AI Resume Analyzer",
      description: "Upload your resume in PDF or image format to get an instant ATS score and recruiter feedback.",
      icon: <FaFileAlt size={22} />,
      path: "/resume-analyzer",
      gradient: "from-[#5B21B6] to-[#6366F1]",
      status: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717] flex flex-col justify-between">
      <Nav />
      
      <div className="pt-32 pb-24 px-6 relative overflow-hidden flex-1">
        <DotGridBackground />
        <div className="container mx-auto max-w-7xl relative z-10">
          
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-xs font-black uppercase tracking-wider text-[#5B21B6] mb-4">
              <FiZap /> Next-Gen AI Learning Suite
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-[#171717] tracking-tight">
              Student AI Hub
            </h1>
            <p className="text-[#666666] text-base md:text-lg font-medium leading-relaxed">
              Ask our intelligent AI assistant anything directly, or launch any of our specialized AI learning tools below.
            </p>
          </div>

          {/* Interactive AI Assistant Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEEEF2] shadow-[0_8px_30px_rgba(91,33,182,0.06)] mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] flex items-center justify-center text-white shadow-sm">
                <FiCpu size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#171717]">Ask LearnAI Assistant Anything</h2>
                <p className="text-xs text-[#666666]">Instant answers, code solutions, concept breakdowns, and learning advice.</p>
              </div>
            </div>

            <form onSubmit={handleAskAI} className="space-y-4">
              <div className="relative flex items-center bg-[#FAFAFC] border-2 border-[#EEEEF2] focus-within:border-[#7C3AED] rounded-2xl p-2 transition-all shadow-inner">
                <input
                  type="text"
                  placeholder="Ask any question... (e.g. How does asynchronous JavaScript work?)"
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-[#171717] placeholder-gray-400 text-sm sm:text-base font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 shadow-[0_4px_14px_rgba(91,33,182,0.25)] cursor-pointer shrink-0 text-sm"
                >
                  {loading ? (
                    <ClipLoader size={18} color="white" />
                  ) : (
                    <>
                      <span>Ask AI</span>
                      <FiSend size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Try asking:</span>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleAskAI(e, p)}
                    className="text-xs font-semibold bg-[#F5F0FF] text-[#5B21B6] hover:bg-[#EDE5FF] px-3 py-1.5 rounded-full border border-[#DDD6FE] transition-all cursor-pointer text-left truncate max-w-[280px] sm:max-w-none"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </form>

            {/* AI Response Display */}
            {response && (
              <div className="mt-6 pt-6 border-t border-[#EEEEF2] animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#5B21B6]">
                    <FiZap /> AI Generated Answer
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#5B21B6] bg-gray-100 hover:bg-[#F5F0FF] px-3 py-1.5 rounded-lg border border-[#EEEEF2] transition-all cursor-pointer"
                    >
                      {copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                      <span>{copied ? "Copied!" : "Copy Answer"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setResponse("")}
                      className="text-xs font-bold text-gray-400 hover:text-red-500 px-2 py-1 transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                <div className="bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl p-6 text-sm text-[#171717] leading-relaxed overflow-x-auto whitespace-pre-wrap font-sans shadow-sm">
                  {response}
                </div>
              </div>
            )}
          </div>

          {/* Section Title */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#171717]">Dedicated Specialized AI Tools</h2>
            <span className="text-xs text-[#666666] font-bold uppercase tracking-wider">6 Active AI Modules</span>
          </div>

          {/* Tools Grid */}
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
                  
                  <p className="text-[#666666] leading-relaxed font-medium mb-6 text-sm">
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
