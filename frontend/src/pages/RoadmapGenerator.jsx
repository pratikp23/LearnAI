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
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--body-text)] font-['Outfit']">
      <Nav />
      
      {/* Hero Section */}
      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-[var(--dark-brown)]">
            AI Roadmap Generator
          </h1>
          <p className="text-[var(--body-text)] text-lg mb-10 max-w-2xl mx-auto opacity-85">
            Unlock your potential with a personalized learning path. Tell our AI what you want to master, and we'll map out the journey for you.
          </p>

          {/* Input Area */}
          <form onSubmit={handleGenerate} className="relative group max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white/95 border-2 border-[var(--glass-border)] rounded-2xl p-2 focus-within:border-[var(--neon-blue)] transition-all shadow-md">
              <input
                type="text"
                placeholder="e.g. Master Web Development, Learn AI, Blockchain Basics..."
                className="w-full bg-transparent border-none outline-none px-6 py-4 text-[#1a1a1a] placeholder-gray-400 text-base md:text-lg font-medium"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3E5F44] hover:bg-[#2e4733] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-md cursor-pointer shrink-0"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Generate</span>
                    <FiZap size={20} />
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
              <div className="p-3 bg-[var(--neon-blue)]/15 rounded-xl border border-[var(--neon-blue)]/30 text-[var(--deep-green)]">
                <FiMap size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-[var(--dark-brown)]">{roadmap.title}</h2>
            </div>

            <div className="relative space-y-10">
              {/* Vertical Line */}
              <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-[var(--deep-green)]/30"></div>

              {roadmap.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-16 group">
                  {/* Phase Marker */}
                  <div className="absolute left-0 top-0 w-12 h-12 bg-white border-2 border-[var(--deep-green)] rounded-full flex items-center justify-center text-[var(--deep-green)] font-extrabold shadow-md">
                    {idx + 1}
                  </div>

                  <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] shadow-md">
                    <h3 className="text-2xl font-bold text-[var(--deep-green)] mb-6 flex items-center gap-3">
                      <FiTarget />
                      {phase.name}
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {phase.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-white/80 p-5 rounded-2xl border border-[var(--glass-border)] shadow-sm">
                          <h4 className="font-bold text-lg text-[var(--dark-brown)] mb-2">{item.title}</h4>
                          <p className="text-[var(--body-text)] text-sm leading-relaxed opacity-85">{item.description}</p>
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
            <div className="text-center py-20 text-[var(--dark-brown)] opacity-60">
              <FiTarget size={64} className="mx-auto mb-4 text-[var(--deep-green)]" />
              <p className="text-lg font-semibold">Your learning roadmap will appear here...</p>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RoadmapGenerator;
