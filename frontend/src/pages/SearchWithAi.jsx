import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import aiIcon from "../assets/ai.png"
import aiResultIcon from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong, FaMagnifyingGlass } from "react-icons/fa6";
import { ClipLoader } from 'react-spinners';
import DotGridBackground from '../components/DotGridBackground';

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [aiMessage, setAiMessage] = useState('');
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const startSound = new Audio(start)

  function speak(message) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    let utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }

  const handleSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    setListening(true);
    startSound.play().catch(() => {});
    
    recognition.start();

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setListening(false);
      if (event.error === 'not-allowed') toast.error("Microphone access denied.");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleRecommendation = async (query) => {
    const searchQuery = query || input;
    if (!searchQuery) return toast.info("Please enter or say something to search.");

    setLoading(true);
    setAiMessage('');
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: searchQuery }, { withCredentials: true });
      const { message, courses } = result.data;
      
      setRecommendations(courses);
      setAiMessage(message);
      
      if (message) {
        speak(message);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("AI Assistant is having trouble right now. Please try again later.");
    } finally {
      setLoading(false);
      setListening(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex flex-col items-center bg-[#FAFAFC] relative overflow-hidden">
      <DotGridBackground className="text-[#7C3AED]/20" />
      
      {/* Header & Back Button */}
      <div className="max-w-4xl w-full mb-12 animate-fade-in flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FaArrowLeftLong 
            className="text-2xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors" 
            onClick={() => navigate("/")} 
          />
          <h1 className="text-3xl font-black text-[#171717] tracking-tight">AI Assistant</h1>
        </div>
      </div>

      {/* Main Search Interface */}
      <div className="max-w-3xl w-full animate-slide-up">
        <div className="bg-white p-10 rounded-[2.5rem] border border-[#EEEEF2] relative overflow-hidden shadow-[0_10px_35px_rgba(91,33,182,0.06)]">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F5F0FF] blur-[60px] rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FFF3E8] blur-[60px] rounded-full"></div>

          <div className="relative flex flex-col items-center">
            <div className={`w-24 h-24 rounded-3xl bg-[#F5F0FF] border-2 border-[#DDD6FE] shadow-sm flex items-center justify-center mb-8 transition-all duration-300 ${listening ? 'scale-110 border-[#FC8019] shadow-[0_0_25px_rgba(252,128,25,0.4)]' : ''}`}>
              <img src={aiIcon} className={`w-12 h-12 ${listening ? 'animate-pulse' : ''}`} alt="AI" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-[#171717] text-center mb-8">
              What do you want to <span className="text-[#5B21B6]">master today?</span>
            </h2>

            <div className="w-full relative group">
              <input
                type="text"
                className="w-full px-8 py-5 pr-32 bg-[#FAFAFC] border-2 border-[#EEEEF2] focus:border-[#7C3AED] rounded-full text-base md:text-lg font-medium shadow-sm transition-all text-[#171717]"
                placeholder="Ask me anything... (e.g. 'Show me Web Dev courses')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRecommendation()}
              />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {input && (
                  <button
                    onClick={() => handleRecommendation()}
                    className="p-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    title="Search"
                  >
                    <FaMagnifyingGlass size={16} />
                  </button>
                )}
                <button
                  className={`p-3.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center ${listening ? 'mic-btn-active' : 'mic-btn'}`}
                  onClick={handleSearch}
                  title={listening ? "Listening... click to stop" : "Click to speak"}
                >
                  <RiMicAiFill size={22} className={listening ? 'animate-bounce' : ''} />
                </button>
              </div>
            </div>

            <p className="mt-6 text-[#666666] text-sm font-semibold tracking-wide">
              {listening ? "🎙️ I'm listening... speak now" : "💡 Click the mic or type to discover curated courses"}
            </p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl w-full mt-20">
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <ClipLoader color="#5B21B6" size={40} />
            <p className="text-[#5B21B6] font-bold uppercase tracking-widest text-xs">SkillUp AI is thinking...</p>
          </div>
        ) : (recommendations.length > 0 || aiMessage) ? (
          <div className="animate-fade-in">
            {/* AI Message Bubble */}
            {aiMessage && (
              <div className="flex justify-center mb-12">
                <div className="bg-white px-8 py-5 rounded-2xl border-l-4 border-[#5B21B6] border border-[#EEEEF2] animate-slide-up shadow-md max-w-2xl">
                  <p className="text-lg text-[#171717] font-semibold italic">"{aiMessage}"</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] flex-1 bg-[#EEEEF2]"></div>
              <div className="flex items-center gap-3">
                <img src={aiResultIcon} className="w-10 h-10 p-2 bg-[#F5F0FF] rounded-xl border border-[#DDD6FE]" alt="Results" />
                <h2 className="text-xs font-black text-[#5B21B6] tracking-[0.2em] uppercase">Curated for you</h2>
              </div>
              <div className="h-[1px] flex-1 bg-[#EEEEF2]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((course, index) => (
                <div
                  key={course._id}
                  className="bg-white p-6 rounded-2xl group border border-[#EEEEF2] hover:border-[#DDD6FE] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(91,33,182,0.08)] transition-all cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                >
                  <div className="flex flex-col h-full">
                    <span className="text-[10px] font-black text-[#5B21B6] uppercase tracking-wider mb-3 bg-[#F5F0FF] w-fit px-3 py-1 rounded-full border border-[#DDD6FE]">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#5B21B6] transition-colors line-clamp-2 mb-6">
                      {course.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#EEEEF2]">
                      <span className="text-xs text-[#666666] font-bold uppercase tracking-wider">{course.level}</span>
                      <div className="text-[#5B21B6] font-black text-xl">₹{course.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !listening && input && !loading && (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-[#666666] text-xl font-medium">No direct matches found. Try asking about categories like 'Web Dev' or 'AI'.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;
