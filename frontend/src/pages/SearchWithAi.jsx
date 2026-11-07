import React, { useState, useEffect, useRef } from 'react'
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
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const startSoundRef = useRef(null);
  const inputRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const latestInputRef = useRef('');

  // Keep latestInputRef updated for closure safety
  useEffect(() => {
    latestInputRef.current = input;
  }, [input]);

  useEffect(() => {
    try {
      startSoundRef.current = new Audio(start);
    } catch (e) {
      console.warn("Audio initialization warning:", e);
    }

    return () => {
      // Clean up recognition, timer, and voice synthesis on unmount
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function speak(message) {
    if (!window.speechSynthesis || !message) return;
    try {
      window.speechSynthesis.cancel();
      // Remove any markdown asterisks/hashes for clean natural speech
      const cleanMessage = message.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  const handleSearch = () => {
    // If currently listening, clicking the mic stops it and searches what was spoken
    if (listening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setListening(false);
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (latestInputRef.current.trim()) {
        handleRecommendation(latestInputRef.current.trim());
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.info("Speech recognition isn't supported in this browser. You can type directly in the search box!");
      inputRef.current?.focus();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;       // Keep listening across pauses
      recognition.interimResults = true;    // Stream words into the input in real-time
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        if (startSoundRef.current) {
          startSoundRef.current.play().catch(() => {});
        }
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        const cleaned = transcript.trim();
        if (cleaned) {
          setInput(cleaned);
          latestInputRef.current = cleaned;

          // Auto-submit 2.5 seconds after user stops speaking
          if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
          speechTimeoutRef.current = setTimeout(() => {
            try {
              recognition.stop();
            } catch (e) {}
            setListening(false);
            handleRecommendation(cleaned);
          }, 2500);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech Recognition Status:", event.error);
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

        // Ignore harmless ambient silence events
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }

        setListening(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          toast.error("Microphone access is blocked. Please click the lock icon 🔒 in your browser address bar to allow microphone.");
        } else if (event.error === 'network') {
          toast.info("Browser voice service is unavailable on your network. You can type your query in the search box below!");
          inputRef.current?.focus();
        } else if (event.error === 'audio-capture') {
          toast.error("No microphone detected. Please connect a headset or microphone, or type your query.");
          inputRef.current?.focus();
        } else {
          toast.info("Voice input ended. You can type your search query directly.");
          inputRef.current?.focus();
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition initialization error:", err);
      setListening(false);
      toast.info("Please type your search query in the box below.");
      inputRef.current?.focus();
    }
  };

  const handleRecommendation = async (query) => {
    const searchQuery = (typeof query === 'string' ? query : input)?.trim();
    if (!searchQuery) return toast.info("Please enter or say something to search.");

    setLoading(true);
    setAiMessage('');
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: searchQuery }, { withCredentials: true });
      const { message, courses } = result.data;
      
      setRecommendations(courses || []);
      setAiMessage(message || `Found courses matching "${searchQuery}"`);
      
      if (message) {
        speak(message);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error(error.response?.data?.message || "AI Assistant took longer to respond. Please try again or type directly.");
    } finally {
      setLoading(false);
      setListening(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex flex-col items-center bg-[#FAFAFC] relative overflow-hidden">
      <DotGridBackground />
      
      {/* Header & Back Button */}
      <div className="max-w-4xl w-full mb-12 animate-fade-in flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl bg-white hover:bg-[#F5F0FF] border border-[#EEEEF2] hover:border-[#DDD6FE] flex items-center justify-center text-[#171717] hover:text-[#5B21B6] transition-all cursor-pointer shadow-sm"
            title="Back to Home"
          >
            <FaArrowLeftLong className="text-base" />
          </button>
          <h1 className="text-3xl font-black text-[#171717] tracking-tight">AI Assistant</h1>
        </div>
      </div>

      {/* Main Search Interface */}
      <div className="max-w-3xl w-full animate-slide-up relative z-10">
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-[#EEEEF2] relative overflow-hidden shadow-[0_10px_35px_rgba(91,33,182,0.06)]">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F5F0FF] blur-[60px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FFF3E8] blur-[60px] rounded-full pointer-events-none"></div>

          <div className="relative flex flex-col items-center">
            <div className={`w-24 h-24 rounded-3xl bg-[#F5F0FF] border-2 border-[#DDD6FE] shadow-sm flex items-center justify-center mb-6 transition-all duration-300 ${listening ? 'scale-110 border-[#FC8019] shadow-[0_0_25px_rgba(252,128,25,0.4)]' : ''}`}>
              <img src={aiIcon} className={`w-12 h-12 ${listening ? 'animate-pulse' : ''}`} alt="AI" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-[#171717] text-center mb-8">
              What do you want to <span className="text-[#5B21B6]">master today?</span>
            </h2>

            <div className="w-full relative group">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-7 sm:px-8 py-4 sm:py-5 pr-32 bg-[#FAFAFC] border-2 border-[#EEEEF2] focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10 rounded-full text-base md:text-lg font-medium shadow-sm transition-all text-[#171717] placeholder:text-[#666666]/60 outline-none"
                placeholder="Ask me anything... (e.g. 'Show me Web Dev courses')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRecommendation()}
              />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {input && (
                  <button
                    onClick={() => handleRecommendation()}
                    className="p-3 sm:p-3.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    title="Search"
                  >
                    <FaMagnifyingGlass size={16} />
                  </button>
                )}
                <button
                  className={`p-3 sm:p-3.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center ${listening ? 'mic-btn-active' : 'mic-btn'}`}
                  onClick={handleSearch}
                  title={listening ? "Listening... click to stop" : "Click to speak"}
                >
                  <RiMicAiFill size={22} className={listening ? 'animate-bounce' : ''} />
                </button>
              </div>
            </div>

            <p className="mt-6 text-[#666666] text-sm font-semibold tracking-wide text-center">
              {listening ? "🎙️ I'm listening... speak now (click mic again to stop)" : "💡 Click the mic to speak, or type your query"}
            </p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl w-full mt-16 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-fade-in py-12">
            <ClipLoader size={50} color="#5B21B6" />
            <p className="text-sm font-bold text-[#5B21B6] animate-pulse uppercase tracking-wider">
              AI is analyzing your request & curating courses...
            </p>
          </div>
        ) : (
          recommendations.length > 0 && (
            <div className="space-y-8 animate-fade-in">
              {/* AI Response Card */}
              {aiMessage && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEEEF2] shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F0FF] border border-[#DDD6FE] flex items-center justify-center shrink-0">
                    <img src={aiResultIcon} className="w-7 h-7" alt="AI Advice" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#5B21B6] bg-[#F5F0FF] px-2.5 py-0.5 rounded-md border border-[#DDD6FE] mb-1.5 inline-block">
                      AI Mentor Advice
                    </span>
                    <p className="text-base sm:text-lg text-[#171717] font-semibold leading-relaxed">
                      {aiMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Course Recommendations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/viewcourse/${course._id}`)}
                    className="group bg-white rounded-3xl p-5 border border-[#EEEEF2] hover:border-[#DDD6FE] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(91,33,182,0.08)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#FAFAFC] mb-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#5B21B6] border border-[#EEEEF2] shadow-sm">
                          {course.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-black text-[#171717] group-hover:text-[#5B21B6] transition-colors line-clamp-2 mb-2">
                        {course.title}
                      </h3>

                      {/* SubTitle / Description */}
                      <p className="text-xs text-[#666666] line-clamp-2 font-medium mb-4">
                        {course.subTitle || course.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-4 border-t border-[#EEEEF2] flex items-center justify-between">
                      <span className="text-xl font-black text-[#171717]">
                        ₹{course.price}
                      </span>
                      <span className="text-xs font-black text-[#FC8019] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        View Course →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;
