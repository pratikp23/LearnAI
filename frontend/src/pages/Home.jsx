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
import DotGridBackground from "../components/DotGridBackground";

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
    <div className="w-full overflow-hidden bg-[#FAFAFC]">
      {/* Hero Section */}
      <div className="w-full min-h-screen relative flex flex-col items-center justify-start pt-24 pb-12 overflow-hidden">
        <Nav />

        {/* Background Image with Clean Light Overlay */}
        <div className="absolute top-0 left-0 w-full h-full z-[-1]">
          <img
            src={home}
            className="object-cover w-full h-full opacity-20"
            alt="Background"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/60 via-white/90 to-[#FAFAFC]"></div>
        </div>

        {/* Selective Decorative Dot-Grid Background */}
        <DotGridBackground />

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center text-center mt-[10vh] px-6 animate-slide-up z-10 w-full max-w-5xl">

          {/* Badge */}
          {/* <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#DDD6FE] bg-[#F5F0FF] shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse inline-block"></span>
            <span className="text-xs font-black tracking-widest uppercase text-[#5B21B6]">AI-Powered Learning Platform</span>
          </div> */}

          {/* Main Heading */}
          <h1 className="font-black leading-tight tracking-tight mb-5" style={{fontSize: "clamp(2.4rem, 7vw, 5.2rem)"}}>
            <span className="block text-[#171717]">
              The Smartest Way To
            </span>
            {/* Typewriter line */}
            <span
              className="block text-[#5B21B6] mt-1"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                borderRight: "3px solid #FC8019",
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
            className="mb-10 font-medium leading-relaxed"
            style={{
              color: "#666666",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              maxWidth: "580px",
              lineHeight: "1.75"
            }}
          >
            Unlock your potential with <strong style={{fontWeight: 700, color: "#5B21B6"}}>premium courses</strong> and modern AI-powered mentorship built for fast-moving careers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
            <button
              className="px-9 py-4 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-full text-base font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-[0_4px_16px_rgba(91,33,182,0.3)] hover:shadow-[0_8px_24px_rgba(91,33,182,0.4)] cursor-pointer"
              onClick={() => navigate("/allcourses")}
            >
              <span>View All Courses</span>
              <SiViaplay className="w-5 h-5 text-[#FC8019]" />
            </button>

            <button
              className="px-8 py-3.5 bg-white hover:bg-[#FFF3E8] border-2 border-[#FC8019] text-[#FC8019] hover:text-[#E86F07] rounded-full text-base font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-[0_4px_14px_rgba(252,128,25,0.15)] cursor-pointer"
              onClick={() => navigate("/searchwithai")}
            >
              <span>Search with AI</span>
              <img src={ai} className="w-6 h-6 rounded-full ml-1 hidden lg:block" alt="AI" />
              <img src={ai1} className="w-6 h-6 rounded-full ml-1 lg:hidden" alt="AI" />
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
