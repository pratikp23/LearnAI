import React, { useState, useRef, useEffect } from "react";
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

  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (listening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        setListening(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please allow microphone permission.");
        } else if (event.error === 'no-speech') {
          toast.info("No speech detected. Please speak clearly into your mic.");
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Voice input error:", err);
      setListening(false);
    }
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
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717]">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {!questions.length ? (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3E8] border border-[#FED7AA] text-xs font-black uppercase tracking-wider text-[#FC8019] mb-4">
                🎯 Real-Time Voice Practice
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-4">AI Interview Simulator</h1>
              <p className="text-[#666666] text-base md:text-lg mb-10 font-medium">Select your target role and let our AI interview you with targeted feedback.</p>
              
              <form onSubmit={startInterview} className="bg-white p-8 rounded-3xl border border-[#EEEEF2] max-w-xl mx-auto shadow-[0_6px_25px_rgba(91,33,182,0.06)]">
                <div className="mb-6 text-left">
                  <label className="block text-xs font-black text-[#171717] uppercase tracking-wider mb-2.5">Target Job Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer, Data Scientist..."
                    className="w-full bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-2xl px-5 py-4 outline-none font-medium shadow-sm text-[#171717]"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                
                <div className="mb-8 text-left">
                  <label className="block text-xs font-black text-[#171717] uppercase tracking-wider mb-2.5">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                          level === lvl 
                            ? "bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm" 
                            : "bg-white border-[#EEEEF2] text-[#666666] hover:bg-[#F5F0FF]"
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
                  className="w-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(91,33,182,0.25)] cursor-pointer"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiPlay /> Start Simulation</>}
                </button>
              </form>
            </div>
          ) : !finished ? (
            <div className="animate-fade-in">
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[#5B21B6] font-black tracking-wider uppercase text-sm">Question {currentIndex + 1} of {questions.length}</span>
                <div className="w-64 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5B21B6] transition-all duration-500 rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2rem] border border-[#EEEEF2] shadow-md relative overflow-hidden">
                <h2 className="text-2xl md:text-3xl font-bold text-[#171717] mb-6 leading-tight">{questions[currentIndex].question}</h2>
                
                <div className="relative mb-6">
                  <textarea
                    className="w-full bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl p-6 min-h-[200px] focus:border-[#7C3AED] outline-none transition-all text-base text-[#171717] placeholder-gray-400 resize-none shadow-sm"
                    placeholder="Type or speak your answer here... Be as detailed as possible."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />

                  {/* Mic Voice Button */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    title={listening ? "Listening... click to stop" : "Speak your answer"}
                    className={`absolute bottom-4 right-4 p-3.5 rounded-full flex items-center justify-center transition-all ${
                      listening ? "mic-btn-active" : "mic-btn"
                    }`}
                  >
                    <RiMicAiFill size={20} className={listening ? "animate-bounce" : ""} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xs text-[#666666] font-semibold">
                    {listening ? "🎙️ Recording answer... speak now" : "💡 Tip: You can type or click the mic button to answer."}
                  </span>
                  <button
                    onClick={submitAnswer}
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#FC8019] hover:bg-[#E86F07] text-white px-8 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiCheckCircle /> Submit Answer</>}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="text-center mb-14">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#FC8019] to-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <FiAward size={40} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-3">Interview Complete!</h1>
                <p className="text-[#666666] text-base md:text-lg font-medium">Here is your comprehensive performance analysis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] text-center shadow-sm">
                  <FiCheckCircle className="mx-auto mb-3 text-[#16A34A]" size={32} />
                  <div className="text-3xl font-black text-[#171717] mb-1">{Math.round(results.reduce((a,c)=>a+c.accuracyScore,0)/results.length)}/10</div>
                  <div className="text-xs text-[#666666] uppercase font-bold tracking-wider">Technical Accuracy</div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] text-center shadow-sm">
                  <FiCpu className="mx-auto mb-3 text-[#5B21B6]" size={32} />
                  <div className="text-3xl font-black text-[#171717] mb-1">{Math.round(results.reduce((a,c)=>a+c.confidenceScore,0)/results.length)}/10</div>
                  <div className="text-xs text-[#666666] uppercase font-bold tracking-wider">Confidence Level</div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] text-center shadow-sm">
                  <FiMessageCircle className="mx-auto mb-3 text-[#FC8019]" size={32} />
                  <div className="text-3xl font-black text-[#171717] mb-1">{Math.round(results.reduce((a,c)=>a+c.communicationScore,0)/results.length)}/10</div>
                  <div className="text-xs text-[#666666] uppercase font-bold tracking-wider">Communication</div>
                </div>
              </div>

              <div className="space-y-6">
                {results.map((res, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-sm">
                    <h3 className="text-xl font-bold text-[#171717] mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#F5F0FF] text-[#5B21B6] font-black flex items-center justify-center text-sm border border-[#DDD6FE]">{idx + 1}</span>
                      {res.question}
                    </h3>
                    <div className="bg-[#FAFAFC] p-5 rounded-2xl border border-[#EEEEF2] mb-4">
                      <p className="text-[#666666] italic font-medium">"{res.feedback}"</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {res.suggestions?.map((s, i) => (
                        <span key={i} className="text-xs font-bold px-3 py-1.5 bg-[#F5F0FF] text-[#5B21B6] rounded-full border border-[#DDD6FE]">
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
                  className="px-8 py-3.5 bg-white hover:bg-gray-50 text-[#171717] border border-[#EEEEF2] rounded-xl font-bold shadow-sm transition-all cursor-pointer"
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
