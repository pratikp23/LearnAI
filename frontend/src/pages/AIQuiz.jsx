import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiArrowRight, FiRotateCcw, FiZap, FiClock } from "react-icons/fi";

const AIQuiz = () => {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [customTime, setCustomTime] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [isTimedMode, setIsTimedMode] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isTimedMode && timerActive && timeLeft > 0 && selectedOption === null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimedMode && timeLeft === 0 && selectedOption === null) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, selectedOption, isTimedMode]);

  const handleTimeUp = () => {
    setSelectedOption(-1);
    toast.warning("Time is up!");
    setExplanation(questions[currentIndex].explanation);
    trackMistakeOnServer(-1);
  };

  const startQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return toast.error("Please enter a topic");
    
    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-quiz`, { topic, count: 5 });
      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setExplanation("");
      setTimeLeft(customTime);
      setTimerActive(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const trackMistakeOnServer = async (idx) => {
    try {
      await axios.post(`${serverUrl}/api/ai/track-mistake`, {
        topic,
        question: questions[currentIndex].question,
        wrongAnswer: idx === -1 ? "Timed Out" : questions[currentIndex].options[idx],
        correctAnswer: questions[currentIndex].options[questions[currentIndex].correctAnswerIndex],
        explanation: questions[currentIndex].explanation
      }, { withCredentials: true });
    } catch (e) {
      console.error("Failed to track mistake", e);
    }
  };

  const handleOptionSelect = async (idx) => {
    if (selectedOption !== null || timeLeft === 0) return;
    
    setSelectedOption(idx);
    const correct = questions[currentIndex].correctAnswerIndex === idx;
    
    if (correct) {
      setScore(score + 1);
      toast.success("Correct!");
    } else {
      toast.error("Wrong answer");
      trackMistakeOnServer(idx);
    }
    setExplanation(questions[currentIndex].explanation);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setExplanation("");
      setTimeLeft(customTime);
    } else {
      setShowResult(true);
      setTimerActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717]">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          {!questions.length ? (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-xs font-black uppercase tracking-wider text-[#5B21B6] mb-4">
                ⚡ Instant Assessment
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-3">Technical Quiz Generator</h1>
              <p className="text-[#666666] text-base md:text-lg mb-10 font-medium">Test your knowledge across programming, system design, and AI.</p>
              
              <form onSubmit={startQuiz} className="bg-white p-8 rounded-3xl border border-[#EEEEF2] max-w-xl mx-auto shadow-[0_6px_25px_rgba(91,33,182,0.06)]">
                <input
                  type="text"
                  placeholder="Enter topic (e.g. React, Python, Cloud...)"
                  className="w-full bg-[#FAFAFC] border border-[#EEEEF2] focus:border-[#7C3AED] rounded-2xl px-6 py-4 outline-none mb-6 font-medium shadow-sm text-[#171717]"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                
                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#FAFAFC] rounded-2xl border border-[#EEEEF2]">
                    <div className="flex items-center gap-3">
                      <FiClock className={isTimedMode ? "text-[#5B21B6]" : "text-gray-400"} />
                      <span className="font-bold text-[#171717]">Timed Challenge</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTimedMode(!isTimedMode)}
                      className={`w-14 h-8 rounded-full transition-all relative ${isTimedMode ? 'bg-[#5B21B6]' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${isTimedMode ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  {isTimedMode && (
                    <div className="flex items-center justify-between p-4 bg-[#FAFAFC] rounded-2xl border border-[#EEEEF2] animate-fade-in">
                      <span className="text-sm font-bold text-[#171717] uppercase tracking-wider">Seconds per question</span>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        className="w-20 bg-white border border-[#EEEEF2] rounded-xl px-3 py-2 text-center font-bold text-[#171717] focus:border-[#7C3AED] outline-none shadow-sm"
                        value={customTime}
                        onChange={(e) => setCustomTime(parseInt(e.target.value) || 30)}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] shadow-[0_4px_16px_rgba(91,33,182,0.25)] cursor-pointer"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiZap /> Generate Quiz</>}
                </button>
              </form>
            </div>
          ) : !showResult ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[#5B21B6] font-black uppercase tracking-wider text-sm">Question {currentIndex + 1} / {questions.length}</span>
                <div className="flex items-center gap-4">
                    {isTimedMode && (
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${timeLeft < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-[#5B21B6] text-[#5B21B6]'} font-bold transition-all bg-white shadow-sm`}>
                            {timeLeft}
                        </div>
                    )}
                    <span className="text-[#171717] font-bold">Score: {score}</span>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2rem] border border-[#EEEEF2] relative overflow-hidden shadow-md">
                <h2 className="text-2xl font-bold text-[#171717] mb-8 leading-tight">{questions[currentIndex].question}</h2>
                
                <div className="space-y-3.5">
                  {questions[currentIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full text-left p-5 rounded-2xl border-2 font-medium transition-all flex items-center justify-between cursor-pointer shadow-sm ${
                        selectedOption === null 
                          ? "bg-white border-[#EEEEF2] text-[#171717] hover:bg-[#F5F0FF] hover:border-[#DDD6FE]" 
                          : idx === questions[currentIndex].correctAnswerIndex 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold" 
                            : selectedOption === idx 
                              ? "bg-red-50 border-red-500 text-red-800 font-bold" 
                              : "bg-gray-50 border-[#EEEEF2] text-gray-400 opacity-60"
                      }`}
                    >
                      <span className="text-base">{option}</span>
                      {selectedOption !== null && idx === questions[currentIndex].correctAnswerIndex && <FiCheck className="text-emerald-700 text-lg" />}
                      {selectedOption === idx && idx !== questions[currentIndex].correctAnswerIndex && <FiX className="text-red-700 text-lg" />}
                    </button>
                  ))}
                </div>

                {explanation && (
                  <div className="mt-8 p-6 bg-[#FAFAFC] rounded-2xl border border-[#EEEEF2] animate-slide-up">
                    <p className="text-xs text-[#5B21B6] mb-2 font-black uppercase tracking-wider">Explanation</p>
                    <p className="text-[#666666] font-medium leading-relaxed">{explanation}</p>
                  </div>
                )}

                {selectedOption !== null && (
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={nextQuestion}
                      className="bg-[#FC8019] hover:bg-[#E86F07] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md cursor-pointer"
                    >
                      {currentIndex === questions.length - 1 ? "Show Results" : "Next Question"} <FiArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-[#16A34A]">
                <FiCheck size={40} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#171717] mb-3">Quiz Completed!</h1>
              <p className="text-[#666666] text-xl mb-8 font-medium">You scored {score} out of {questions.length}</p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setQuestions([])}
                  className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md cursor-pointer"
                >
                  <FiRotateCcw /> Try Again
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

export default AIQuiz;
