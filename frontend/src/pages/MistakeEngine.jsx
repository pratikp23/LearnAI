import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FiTrendingUp, FiTarget, FiBookOpen, FiActivity, FiZap } from "react-icons/fi";

const MistakeEngine = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/ai/analyze-mistakes`, { withCredentials: true });
        setAnalysis(data.analysis);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--body-text)] font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-amber-500/15 rounded-2xl border border-amber-500/30 text-amber-700 shadow-md">
              <FiTrendingUp size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--dark-brown)] mb-2 tracking-tight">Learn From Your Mistakes</h1>
              <p className="text-[var(--body-text)] opacity-85 font-medium">Our AI analyzes your wrong answers to build a personalized revision path.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[var(--deep-green)] border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-[var(--deep-green)] font-bold uppercase tracking-widest text-sm">Analyzing Patterns...</p>
            </div>
          ) : analysis?.patterns ? (
            <div className="space-y-8 animate-fade-in">
              {/* Summary Card */}
              <div className="glass-card p-10 rounded-[35px] border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                <div className="relative">
                  <h2 className="text-2xl font-bold text-[var(--dark-brown)] mb-4 flex items-center gap-3">
                    <FiActivity className="text-[var(--deep-green)]" />
                    AI Insights Summary
                  </h2>
                  <p className="text-[var(--body-text)] text-lg leading-relaxed italic">"{analysis.summary}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Knowledge Gaps */}
                <div className="glass-card p-8 rounded-[30px] border border-[var(--glass-border)] shadow-md">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-red-600">
                    <FiTarget />
                    Identified Gaps
                  </h3>
                  <div className="space-y-3">
                    {analysis.patterns.map((pattern, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-red-50/70 p-4 rounded-xl border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-red-600 mt-2 shrink-0"></div>
                        <p className="text-red-950 font-medium text-sm">{pattern}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revision Plan */}
                <div className="glass-card p-8 rounded-[30px] border border-[var(--glass-border)] shadow-md">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[var(--deep-green)]">
                    <FiBookOpen />
                    3-Step Revision Plan
                  </h3>
                  <div className="space-y-4">
                    {analysis.revisionPlan.map((step, idx) => (
                      <div key={idx} className="relative pl-10">
                        <div className="absolute left-0 top-0 w-7 h-7 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center font-bold text-sm border border-emerald-300">
                          {idx + 1}
                        </div>
                        <p className="text-[var(--body-text)] text-sm font-medium leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 opacity-60 text-[var(--dark-brown)]">
              <FiZap size={64} className="mx-auto mb-4 text-[var(--deep-green)]" />
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
