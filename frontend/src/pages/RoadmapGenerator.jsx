import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiMap, FiTarget, FiZap } from "react-icons/fi";

const RoadmapGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return toast.error("Please enter a topic");

    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-roadmap`, { topic });
      setRoadmap(data.roadmap);
    } catch (error) {
      toast.error("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717]">
      <Nav />
      
      {/* Hero Section */}
      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-xs font-black uppercase tracking-wider text-[#5B21B6] mb-4">
            🗺️ Step-by-Step Curriculum
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-[#171717]">
            AI Roadmap Generator
          </h1>
          <p className="text-[#666666] text-base md:text-lg mb-10 max-w-2xl mx-auto font-medium">
            Unlock your potential with a structured learning path. Tell our AI what you want to master, and we'll map out the journey for you.
          </p>

          {/* Input Area */}
          <form onSubmit={handleGenerate} className="relative group max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white border-2 border-[#EEEEF2] focus-within:border-[#7C3AED] rounded-2xl p-2 transition-all shadow-sm">
              <input
                type="text"
                placeholder="e.g. Master Web Development, Learn AI, Blockchain Basics..."
                className="w-full bg-transparent border-none outline-none px-6 py-4 text-[#171717] placeholder-gray-400 text-base md:text-lg font-medium"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 shadow-[0_4px_14px_rgba(91,33,182,0.25)] cursor-pointer shrink-0"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Generate</span>
                    <FiZap size={20} className="text-[#FC8019]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="container mx-auto px-6 pb-24">
        {roadmap ? (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-[#F5F0FF] rounded-2xl border border-[#DDD6FE] text-[#5B21B6]">
                <FiMap size={32} />
              </div>
              <h2 className="text-3xl font-black text-[#171717]">{roadmap.title}</h2>
            </div>

            <div className="relative space-y-10">
              {/* Vertical Line */}
              <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-[#DDD6FE]"></div>

              {roadmap.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-16 group">
                  {/* Phase Marker */}
                  <div className="absolute left-0 top-0 w-12 h-12 bg-white border-2 border-[#5B21B6] rounded-full flex items-center justify-center text-[#5B21B6] font-black shadow-sm">
                    {idx + 1}
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-sm">
                    <h3 className="text-2xl font-bold text-[#5B21B6] mb-6 flex items-center gap-3">
                      <FiTarget className="text-[#FC8019]" />
                      {phase.name}
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {phase.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-[#FAFAFC] p-5 rounded-2xl border border-[#EEEEF2]">
                          <h4 className="font-bold text-lg text-[#171717] mb-2">{item.title}</h4>
                          <p className="text-[#666666] text-sm leading-relaxed font-medium">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20 text-gray-400">
              <FiTarget size={56} className="mx-auto mb-4 text-[#DDD6FE]" />
              <p className="text-lg font-medium text-[#666666]">Your learning roadmap will appear here...</p>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RoadmapGenerator;
