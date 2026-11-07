import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiCheckCircle } from "react-icons/fi";

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
      setPlan(data.plan);
    } catch (error) {
      toast.error("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--body-text)] font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--dark-brown)] mb-3">AI Study Planner</h1>
            <p className="text-[var(--body-text)] text-lg opacity-85">Master any skill with a structured daily schedule.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] mb-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-[var(--dark-brown)] uppercase mb-3 tracking-wider">What is your goal?</label>
                <input
                  type="text"
                  placeholder="e.g. Learn React, Master DSA..."
                  className="w-full input-dark rounded-2xl px-6 py-4 outline-none font-medium shadow-sm"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--dark-brown)] uppercase mb-3 tracking-wider">Days to complete</label>
                <input
                  type="number"
                  className="w-full input-dark rounded-2xl px-6 py-4 outline-none font-medium shadow-sm"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-[#3E5F44] hover:bg-[#2e4733] text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              {loading ? "Generating Schedule..." : "Generate My Schedule"}
            </button>
          </div>

          {plan && (
            <div className="space-y-6 animate-fade-in">
              {plan.map((phase, idx) => (
                <div key={idx} className="relative pl-12 group">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-[var(--deep-green)] text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {idx + 1}
                  </div>
                  <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-[var(--dark-brown)]">{phase.focus}</h3>
                      <span className="text-xs font-bold text-[var(--deep-green)] bg-[var(--neon-blue)]/15 px-3 py-1 rounded-lg border border-[var(--neon-blue)]/30">Day {phase.day}</span>
                    </div>
                    <ul className="space-y-3">
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-3 text-[var(--body-text)] text-sm font-medium">
                          <FiCheckCircle className="text-[var(--deep-green)] text-base shrink-0" />
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
