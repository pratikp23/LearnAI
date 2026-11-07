
import React, { useState, useEffect } from "react";
import home from "../assets/home3.jpg";
import Nav from "../components/Nav";
import { SiViaplay } from "react-icons/si";
import Logos from "../components/Logos";
import Cardspage from "../components/Cardspage";
import ExploreCourses from "../components/ExploreCourses";
import About from "../components/About";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import ReviewPage from "../components/ReviewPage";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const texts = [
    "GROW YOUR SKILLS WITH US",
    "MASTER THE FUTURE",
    "LEARN WITHOUT LIMITS",
    "BUILD YOUR DREAM CAREER"
  ];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, texts]);

  return (
    <div className="w-full overflow-hidden bg-transparent">
      {/* Hero Section */}
      <div className="w-full min-h-screen relative flex flex-col items-center justify-start pt-24 pb-12">
        <Nav />

        {/* Background Image with Overlay */}
        <div className="absolute top-0 left-0 w-full h-full z-[-1]">
          <img
            src={home}
            className="object-cover w-full h-full opacity-60"
            alt="Background"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[rgba(15,12,41,0.7)] to-[var(--primary-bg)]"></div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center text-center mt-[10vh] px-6 animate-slide-up z-10 w-full max-w-5xl">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5F8D4E]/40 bg-white/60 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#5F8D4E] animate-pulse inline-block"></span>
            <span className="text-sm font-semibold tracking-widest uppercase" style={{color: "#3E5F44", letterSpacing: "0.1em"}}>AI-Powered Learning Platform</span>
          </div>

          {/* Main Heading — static lines + typewriter on its own line */}
          <h1 className="font-extrabold leading-tight tracking-tight mb-5" style={{fontSize: "clamp(2.4rem, 7vw, 5.5rem)"}}>
            <span className="block" style={{color: "#1a1a1a", textShadow: "0 2px 8px rgba(0,0,0,0.08)"}}>
              The Smartest Way To
            </span>
            {/* Typewriter line — whitespace-nowrap prevents text from running/wrapping */}
            <span
              className="block text-gradient mt-1"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                borderRight: "3px solid #5F8D4E",
                minHeight: "1.2em",
                display: "block",
                paddingRight: "4px",
                animation: "blink-cursor 0.75s step-end infinite"
              }}
            >
              {text || "\u00A0"}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mb-10 font-light leading-relaxed"
            style={{
              color: "#3a3a3a",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              maxWidth: "560px",
              lineHeight: "1.75"
            }}
          >
            Unlock your potential with <strong style={{fontWeight: 600, color: "#3E5F44"}}>premium courses</strong> and AI-powered tools built for the future of learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <button
              className="group relative px-8 py-3.5 bg-transparent border-2 border-[var(--neon-blue)] text-white rounded-full text-base font-semibold overflow-hidden transition-all hover:scale-105 btn-glow cursor-pointer"
              onClick={() => navigate("/allcourses")}
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Courses <SiViaplay className="w-5 h-5 group-hover:animate-pulse" />
              </span>
              <div className="absolute inset-0 bg-[var(--neon-blue)] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>

            <button
              className="group relative px-8 py-3.5 bg-white text-black rounded-full text-base font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
              onClick={() => navigate("/searchwithai")}
            >
              <span className="relative z-10 flex items-center gap-2">
                Search with AI
                <img src={ai} className="w-7 h-7 rounded-full ml-1 hidden lg:block" alt="AI" />
                <img src={ai1} className="w-7 h-7 rounded-full ml-1 lg:hidden" alt="AI" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <Logos />

      <div className="relative z-10 space-y-20 pb-20">
        <ExploreCourses />
        <Cardspage />
        <About />
        <ReviewPage />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
