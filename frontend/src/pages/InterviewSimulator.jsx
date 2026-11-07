import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiPlay, FiCheckCircle, FiAward, FiMessageCircle, FiCpu } from "react-icons/fi";
import { RiMicAiFill } from "react-icons/ri";

const InterviewSimulator = () => {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const [listening, setListening] = useState(false);

  const startInterview = async (e) => {
    e.preventDefault();
    if (!role.trim()) return toast.error("Please enter a role");
    
    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-questions`, { role, level });
      setQuestions(data.questions);
      setResults([]);
      setCurrentIndex(0);
      setFinished(false);
    } catch (error) {
      toast.error("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    setListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'not-allowed') toast.error("Microphone access denied.");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return toast.error("Please enter your answer");

    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/evaluate-response`, {
        question: questions[currentIndex].question,
        answer: userAnswer,
        role: role
      });
      
      const newResults = [...results, { question: questions[currentIndex].question, ...data }];
      setResults(newResults);
      setUserAnswer("");
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    } catch (error) {
      toast.error("Failed to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--body-text)] font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {!questions.length ? (
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--dark-brown)] mb-4">AI Interview Simulator</h1>
              <p className="text-[var(--body-text)] text-lg mb-10 opacity-85">Select your target role and let our AI prepare you for the real deal.</p>
              
              <form onSubmit={startInterview} className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] max-w-xl mx-auto shadow-xl">
                <div className="mb-6 text-left">
                  <label className="block text-xs font-bold text-[var(--dark-brown)] uppercase tracking-widest mb-3">Target Job Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer, Data Scientist..."
                    className="w-full input-dark rounded-2xl px-6 py-4 outline-none font-medium shadow-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                
                <div className="mb-8 text-left">
                  <label className="block text-xs font-bold text-[var(--dark-brown)] uppercase tracking-widest mb-3">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                          level === lvl 
                            ? "bg-[var(--deep-green)] text-white border-[var(--deep-green)] shadow-md" 
                            : "bg-white/80 border-[var(--glass-border)] text-[var(--body-text)] hover:bg-white"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3E5F44] hover:bg-[#2e4733] text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiPlay /> Start Simulation</>}
                </button>
              </form>
            </div>
          ) : !finished ? (
            <div className="animate-fade-in">
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[var(--deep-green)] font-extrabold tracking-wider uppercase text-sm">Question {currentIndex + 1} of {questions.length}</span>
                <div className="w-64 h-2.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--deep-green)] transition-all duration-500 rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[35px] border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--dark-brown)] mb-6 leading-tight">{questions[currentIndex].question}</h2>
                
                <div className="relative mb-6">
                  <textarea
                    className="w-full bg-white/95 border border-[var(--glass-border)] rounded-2xl p-6 min-h-[220px] focus:border-[var(--neon-blue)] outline-none transition-all text-base text-[#1a1a1a] placeholder-gray-400 resize-none shadow-sm"
                    placeholder="Type or speak your answer here... Be as detailed as possible."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />

                  {/* Mic Voice Button */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    title={listening ? "Listening... click to stop" : "Speak your answer"}
                    className={`absolute bottom-4 right-4 p-3 rounded-full flex items-center justify-center transition-all ${
                      listening ? "mic-btn-active" : "mic-btn"
                    }`}
                  >
                    <RiMicAiFill size={20} className={listening ? "animate-bounce" : ""} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--accent-color)] font-semibold">
                    {listening ? "🎙️ Recording answer..." : "💡 Tip: You can type or use the mic button to speak."}
                  </span>
                  <button
                    onClick={submitAnswer}
                    disabled={loading}
                    className="bg-[#3E5F44] hover:bg-[#2e4733] text-white px-8 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiCheckCircle /> Submit Answer</>}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="text-center mb-14">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <FiAward size={40} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--dark-brown)] mb-3">Interview Complete!</h1>
                <p className="text-[var(--body-text)] text-lg opacity-85">Here is your comprehensive performance analysis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] text-center shadow-md">
                  <FiCheckCircle className="mx-auto mb-3 text-[var(--deep-green)]" size={32} />
                  <div className="text-3xl font-extrabold text-[var(--dark-brown)] mb-1">{Math.round(results.reduce((a,c)=>a+c.accuracyScore,0)/results.length)}/10</div>
                  <div className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">Technical Accuracy</div>
                </div>
                <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] text-center shadow-md">
                  <FiCpu className="mx-auto mb-3 text-blue-600" size={32} />
                  <div className="text-3xl font-extrabold text-[var(--dark-brown)] mb-1">{Math.round(results.reduce((a,c)=>a+c.confidenceScore,0)/results.length)}/10</div>
                  <div className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">Confidence Level</div>
                </div>
                <div className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] text-center shadow-md">
                  <FiMessageCircle className="mx-auto mb-3 text-purple-600" size={32} />
                  <div className="text-3xl font-extrabold text-[var(--dark-brown)] mb-1">{Math.round(results.reduce((a,c)=>a+c.communicationScore,0)/results.length)}/10</div>
                  <div className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">Communication</div>
                </div>
              </div>

              <div className="space-y-6">
                {results.map((res, idx) => (
                  <div key={idx} className="glass-card p-8 rounded-3xl border border-[var(--glass-border)] shadow-md">
                    <h3 className="text-xl font-bold text-[var(--dark-brown)] mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--neon-blue)]/20 text-[var(--deep-green)] font-extrabold flex items-center justify-center text-sm">{idx + 1}</span>
                      {res.question}
                    </h3>
                    <div className="bg-white/80 p-5 rounded-2xl border border-[var(--glass-border)] mb-4 shadow-sm">
                      <p className="text-[var(--body-text)] italic">"{res.feedback}"</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {res.suggestions?.map((s, i) => (
                        <span key={i} className="text-xs font-bold px-3 py-1.5 bg-[var(--neon-blue)]/15 text-[var(--deep-green)] rounded-lg border border-[var(--neon-blue)]/30">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-center gap-4">
                <button
                  onClick={() => setQuestions([])}
                  className="px-8 py-3.5 bg-white/80 hover:bg-white text-[var(--dark-brown)] border-2 border-[var(--glass-border)] rounded-xl font-bold shadow-sm transition-all cursor-pointer"
                >
                  Try Another Role
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InterviewSimulator;
