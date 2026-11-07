import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong, FaPlay, FaCirclePlay } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import img from "../assets/empty.jpg";

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);

  useEffect(() => {
    const course = courseData.find((c) => c._id === courseId);
    if (course) {
      setSelectedCourse(course);
      if (course.lectures && course.lectures.length > 0) {
        setSelectedLecture(course.lectures[0]);
      }
    }
  }, [courseId, courseData]);

  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const res = await axios.post(`${serverUrl}/api/course/getcreator`, { userId: selectedCourse.creator }, { withCredentials: true });
          setCreatorData(res.data);
        } catch (e) {
          console.error(e);
        }
      }
    };
    getCreator();
  }, [selectedCourse]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center bg-[#FAFAFC] text-[#171717]">
      <div className="max-w-7xl w-full animate-fade-in flex flex-col lg:flex-row gap-8">
        
        {/* Left - Video Player & Info */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#EEEEF2] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <FaArrowLeftLong 
                className="text-xl text-[#171717] hover:text-[#5B21B6] cursor-pointer transition-colors" 
                onClick={() => navigate(`/viewcourse/${courseId}`)} 
              />
              <div>
                <h1 className="text-xl font-bold text-[#171717] line-clamp-1">{selectedCourse?.title}</h1>
                <p className="text-xs text-[#666666] font-bold uppercase tracking-wider">{selectedCourse?.category} • {selectedCourse?.level}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#EEEEF2] shadow-md bg-white">
            <div className="aspect-video w-full bg-black flex items-center justify-center relative">
              {selectedLecture?.videoUrl ? (
                selectedLecture.videoUrl.includes("youtube.com") || selectedLecture.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedLecture.videoUrl.split('v=')[1]?.split('&')[0] || selectedLecture.videoUrl.split('/').pop()}`}
                    className="w-full h-full"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                    autoPlay
                  />
                )
              ) : (
                <div className="text-center space-y-3">
                  <FaCirclePlay size={48} className="text-gray-500 mx-auto animate-pulse" />
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Select a module to start learning</p>
                </div>
              )}
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#171717] mb-2">{selectedLecture?.lectureTitle || "Welcome to the Course"}</h2>
              <div className="h-1 w-16 bg-[#5B21B6] rounded-full mb-4"></div>
              <p className="text-[#666666] text-sm leading-relaxed font-medium">
                Enjoy your learning journey. This lecture covers key concepts in {selectedCourse?.title}. 
                Make sure to take notes and practice the concepts demonstrated in the video.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Curriculum & Instructor */}
        <div className="lg:w-1/3 space-y-8">
          
          {/* Lecture List */}
          <div className="bg-white p-6 rounded-[2rem] border border-[#EEEEF2] h-fit shadow-sm">
            <h2 className="text-xl font-bold text-[#171717] mb-6 flex items-center justify-between">
              Curriculum
              <span className="text-xs text-[#5B21B6] font-black uppercase tracking-wider px-3 py-1 bg-[#F5F0FF] rounded-full border border-[#DDD6FE]">
                {selectedCourse?.lectures?.length || 0} Modules
              </span>
            </h2>
            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group cursor-pointer ${
                      selectedLecture?._id === lecture._id
                        ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm'
                        : 'bg-white border-[#EEEEF2] text-[#171717] hover:bg-[#F5F0FF] hover:border-[#DDD6FE]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-black ${selectedLecture?._id === lecture._id ? 'text-white' : 'text-[#5B21B6]'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className={`text-sm font-bold truncate max-w-[170px] ${selectedLecture?._id === lecture._id ? 'text-white' : 'text-[#171717]'}`}>
                        {lecture.lectureTitle}
                      </h4>
                    </div>
                    <FaPlay size={12} className={selectedLecture?._id === lecture._id ? 'text-white' : 'text-[#FC8019]'} />
                  </button>
                ))
              ) : (
                <p className="text-gray-400 italic text-center py-10 font-medium">No lectures available.</p>
              )}
            </div>
          </div>

          {/* Instructor Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-[#EEEEF2] shadow-sm">
            <h3 className="text-xs font-black text-[#5B21B6] uppercase tracking-wider mb-4">Course Instructor</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#7C3AED] shadow-sm shrink-0">
                {creatorData?.photoUrl ? (
                  <img
                    src={creatorData.photoUrl}
                    alt="Instructor"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] flex items-center justify-center text-white font-bold text-xl ${creatorData?.photoUrl ? 'hidden' : 'flex'}`}>
                  {creatorData?.name ? creatorData.name.slice(0, 1).toUpperCase() : "I"}
                </div>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[#171717] font-bold text-base truncate">{creatorData?.name || "LearnAI Mentor"}</h4>
                <p className="text-xs text-[#666666] font-medium truncate">
                  {creatorData?.description || 'Subject Matter Expert'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;
