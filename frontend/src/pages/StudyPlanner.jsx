import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiCheckCircle } from "react-icons/fi";
import DotGridBackground from "../components/DotGridBackground";

const StudyPlanner = () => {
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const generatePlan = async () => {
    if (!goal.trim()) return toast.error("Please enter a goal");

    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-study-plan`, { goal, days });
      const planList = Array.isArray(data) ? data : (data.plan || []);
      setPlan(planList);
      toast.success("Study schedule generated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717] flex flex-col justify-between">
      <Nav />
      
      <div className="pt-32 pb-24 px-6 relative overflow-hidden flex-1">
        <DotGridBackground />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3E8] border border-[#FED7AA] text-xs font-black uppercase tracking-wider text-[#FC8019] mb-4">
              📅 Daily Schedule Generator
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-3">AI Study Planner</h1>
            <p className="text-[#666666] text-base md:text-lg font-medium">Master any skill with a structured, step-by-step daily schedule.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] mb-12 shadow-[0_6px_25px_rgba(91,33,182,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-black text-[#171717] uppercase mb-2.5 tracking-wider">What is your target goal?</label>
                <input
                  type="text"
                  placeholder="e.g. Learn React, Master System Design..."
                  className="w-full bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-2xl px-5 py-4 outline-none font-medium shadow-sm text-[#171717]"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[#171717] uppercase mb-2.5 tracking-wider">Days to complete</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  className="w-full bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-2xl px-5 py-4 outline-none font-medium shadow-sm text-[#171717]"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.01] active:scale-95 transition-all shadow-[0_4px_14px_rgba(91,33,182,0.25)] cursor-pointer"
            >
              {loading ? "Generating Schedule..." : "Generate My Schedule"}
            </button>
          </div>

          {plan && Array.isArray(plan) && plan.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              {plan.map((phase, idx) => (
                <div key={idx} className="relative pl-12 group">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-[#5B21B6] text-white rounded-full flex items-center justify-center font-black shadow-sm text-sm">
                    {idx + 1}
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-[#171717]">{phase.focus}</h3>
                      <span className="text-xs font-black text-[#FC8019] bg-[#FFF3E8] px-3.5 py-1 rounded-full border border-[#FED7AA]">Day {phase.day}</span>
                    </div>
                    <ul className="space-y-3">
                      {phase.tasks && phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-3 text-[#666666] text-sm font-semibold">
                          <FiCheckCircle className="text-[#16A34A] text-base shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudyPlanner;
