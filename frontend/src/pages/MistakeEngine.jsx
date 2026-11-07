import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FiTrendingUp, FiTarget, FiBookOpen, FiActivity, FiZap } from "react-icons/fi";
import DotGridBackground from "../components/DotGridBackground";

const MistakeEngine = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/ai/analyze-mistakes`, { withCredentials: true });
        setAnalysis(data.analysis || data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717] flex flex-col justify-between">
      <Nav />
      
      <div className="pt-32 pb-24 px-6 relative overflow-hidden flex-1">
        <DotGridBackground />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-[#FFF3E8] rounded-2xl border border-[#FED7AA] text-[#FC8019] shadow-sm">
              <FiTrendingUp size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#171717] mb-2 tracking-tight">Learn From Your Mistakes</h1>
              <p className="text-[#666666] font-medium">Our AI analyzes your incorrect responses to build a personalized revision path.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#5B21B6] border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-[#5B21B6] font-bold uppercase tracking-widest text-sm">Analyzing Patterns...</p>
            </div>
          ) : analysis?.patterns ? (
            <div className="space-y-8 animate-fade-in">
              {/* Summary Card */}
              <div className="bg-white p-10 rounded-3xl border border-[#EEEEF2] shadow-sm relative overflow-hidden">
                <div className="relative">
                  <h2 className="text-2xl font-bold text-[#171717] mb-4 flex items-center gap-3">
                    <FiActivity className="text-[#5B21B6]" />
                    AI Insights Summary
                  </h2>
                  <p className="text-[#666666] text-lg leading-relaxed italic font-medium">"{analysis.summary}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Knowledge Gaps */}
                <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-sm">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#DC2626]">
                    <FiTarget />
                    Identified Gaps
                  </h3>
                  <div className="space-y-3">
                    {analysis.patterns.map((pattern, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-red-50/70 p-4 rounded-xl border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-[#DC2626] mt-2 shrink-0"></div>
                        <p className="text-red-950 font-medium text-sm">{pattern}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revision Plan */}
                <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-sm">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#5B21B6]">
                    <FiBookOpen />
                    3-Step Revision Plan
                  </h3>
                  <div className="space-y-4">
                    {analysis.revisionPlan.map((step, idx) => (
                      <div key={idx} className="relative pl-10">
                        <div className="absolute left-0 top-0 w-7 h-7 bg-[#F5F0FF] text-[#5B21B6] rounded-lg flex items-center justify-center font-bold text-sm border border-[#DDD6FE]">
                          {idx + 1}
                        </div>
                        <p className="text-[#666666] text-sm font-medium leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-[#666666]">
              <FiZap size={64} className="mx-auto mb-4 text-[#DDD6FE]" />
              <p className="text-lg font-medium">{analysis?.message || "Not enough data yet. Complete some quizzes first!"}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MistakeEngine;
