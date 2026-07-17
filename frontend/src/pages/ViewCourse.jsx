import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong, FaPlay, FaLock, FaStar, FaCircleCheck } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ViewCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { courseData, selectedCourseData } = useSelector(state => state.course);
    const { userData } = useSelector(state => state.user);
    const { lectureData } = useSelector(state => state.lecture);
    
    const [creatorData, setCreatorData] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);

    const handleReview = async () => {
        if (!rating) return toast.error("Please select a rating");
        if (!comment) return toast.error("Please write a comment");
        
        try {
            const result = await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true });
            toast.success("Review submitted!");
            setRating(0);
            setComment("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        }
    }

    const avgRating = selectedCourseData?.reviews?.length > 0 
        ? (selectedCourseData.reviews.reduce((acc, curr) => acc + curr.rating, 0) / selectedCourseData.reviews.length).toFixed(1)
        : "0.0";

    useEffect(() => {
        const currentCourse = courseData.find(item => item._id === courseId);
        if (currentCourse) {
            dispatch(setSelectedCourseData(currentCourse));
        }
    }, [courseId, courseData, dispatch]);

    useEffect(() => {
        if (userData?.enrolledCourses && courseId) {
            const enrolled = userData.enrolledCourses.some(c => {
                const enrolledId = typeof c === 'string' ? c : c._id;
                return enrolledId?.toString() === courseId.toString();
            });
            setIsEnrolled(enrolled);
        }
    }, [userData, courseId]);

    useEffect(() => {
        const getCreator = async () => {
            if (selectedCourseData?.creator) {
                try {
                    const result = await axios.post(`${serverUrl}/api/course/getcreator`, { userId: selectedCourseData.creator }, { withCredentials: true });
                    setCreatorData(result.data);
                } catch (error) {
                    console.error("Error fetching creator:", error);
                }
            }
        };
        getCreator();
    }, [selectedCourseData]);

    useEffect(() => {
        if (creatorData?._id && courseData.length > 0) {
            const creatorCourses = courseData.filter(course => course.creator === creatorData._id && course._id !== courseId);
            setSelectedCreatorCourse(creatorCourses);
        }
    }, [creatorData, courseData, courseId]);

    if (!userData) {
        return null;
    }

    const handleEnroll = async () => {
        if (!userData) return toast.error("Please login to enroll");
        setEnrollLoading(true);
        try {
            const isFree = !selectedCourseData?.price || selectedCourseData?.price === 0;
            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            
            // DEMO MODE: If key is placeholder or missing, use free enrollment path
            const isDemoMode = !razorpayKey || razorpayKey.includes("add your") || razorpayKey === "";

            if (isFree || isDemoMode) {
                if (isDemoMode && !isFree) {
                    toast.info("Demo Mode: Bypassing payment for testing.");
                }
                const enrollRes = await axios.post(serverUrl + "/api/payment/enroll-free", { courseId, userId: userData._id }, { withCredentials: true });
                const updatedUserRes = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
                dispatch(setUserData(updatedUserRes.data));
                setIsEnrolled(true);
                toast.success(enrollRes.data.message || "Enrollment successful!");
            } else {
                const orderRes = await axios.post(serverUrl + "/api/payment/create-order", { courseId, userId: userData._id }, { withCredentials: true });
                
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: orderRes.data.amount,
                    currency: "INR",
                    name: "SkillUp Premium",
                    description: `Enrollment for ${selectedCourseData.title}`,
                    order_id: orderRes.data.id,
                    handler: async function (response) {
                        try {
                            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", { ...response, courseId, userId: userData._id }, { withCredentials: true });
                            const updatedUserRes = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
                            dispatch(setUserData(updatedUserRes.data));
                            setIsEnrolled(true);
                            toast.success("Payment Successful! Welcome to the course.");
                        } catch (e) {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    },
                    theme: { color: "#00F3FF" }
                };
                
                if (window.Razorpay) {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } else {
                    toast.error("Razorpay SDK not loaded. Please refresh.");
                }
            }
        } catch (err) {
            console.error("Enrollment failed:", err);
            const msg = err.response?.data?.message || "";
            if (msg.includes("RAZORPAY_KEY_ID")) {
                toast.error("Payment gateway not configured. Please add Razorpay keys to .env");
            } else {
                toast.error("Something went wrong during enrollment. Check your connection.");
            }
        } finally {
            setEnrollLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center">
            <div className="max-w-7xl w-full animate-fade-in space-y-10">
                
                {/* Hero Section */}
                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                    <div className="flex flex-col lg:flex-row">
                        {/* Course Media */}
                        <div className="lg:w-1/2 relative group">
                            <img 
                                src={selectedCourseData?.thumbnail || img} 
                                alt="Course" 
                                className="w-full h-[300px] lg:h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                    <FaPlay className="text-white text-2xl translate-x-1" />
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate("/")}
                                className="absolute top-6 left-6 p-3 glass rounded-2xl text-white hover:text-[var(--neon-blue)] transition-all active:scale-90"
                            >
                                <FaArrowLeftLong size={20} />
                            </button>
                        </div>

                        {/* Course CTA */}
                        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[var(--neon-blue)]/20">
                                    {selectedCourseData?.category}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                    <FaStar /> {avgRating} <span className="text-gray-500 font-medium">({selectedCourseData?.reviews?.length || 0} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                                {selectedCourseData?.title}
                            </h1>
                            <p className="text-gray-400 text-lg mb-8 line-clamp-2">
                                {selectedCourseData?.subTitle}
                            </p>

                            <div className="flex items-center gap-6 mb-10">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Price</span>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-black text-white">₹{selectedCourseData?.price || 0}</span>
                                        <span className="text-gray-500 line-through mb-1">₹599</span>
                                    </div>
                                </div>
                                <div className="h-10 w-[1px] bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Access</span>
                                    <span className="text-white font-bold">Lifetime</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {isEnrolled ? (
                                    <button 
                                        className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3"
                                        onClick={() => navigate(`/viewlecture/${courseId}`)}
                                    >
                                        <FaPlay /> Continue Learning
                                    </button>
                                ) : (
                                    <button 
                                        className="flex-1 py-5 bg-white text-black font-black text-xl rounded-2xl shadow-xl hover:bg-[var(--neon-blue)] hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                                        onClick={handleEnroll}
                                        disabled={enrollLoading}
                                    >
                                        {enrollLoading ? <ClipLoader size={24} color="black" /> : "Enroll Now"}
                                    </button>
                                )}
                                <button className="px-10 py-5 glass rounded-2xl text-white font-bold hover:bg-white/10 transition-all">
                                    Add to Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* What you'll learn */}
                        <div className="glass-card p-10 rounded-[2.5rem] border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 bg-[var(--neon-blue)] rounded-full"></span>
                                What you'll learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    `Master ${selectedCourseData?.category} concepts`,
                                    "Real-world project implementation",
                                    "Industry best practices & tips",
                                    "Problem solving & architecture",
                                    "Advanced techniques & workflows",
                                    "Deployment and production readiness"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <FaCircleCheck className="text-[var(--neon-blue)] mt-1 shrink-0" />
                                        <p className="text-gray-300 font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div className="glass-card p-10 rounded-[2.5rem] border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-2">Course Content</h2>
                            <p className="text-gray-500 text-sm mb-8 font-medium uppercase tracking-widest">
                                {selectedCourseData?.lectures?.length || 0} Modules • 12.5 Total Hours
                            </p>
                            
                            <div className="space-y-4">
                                {selectedCourseData?.lectures?.map((lecture, index) => (
                                    <div 
                                        key={index}
                                        className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                                            lecture.isPreviewFree 
                                                ? "bg-white/5 border-white/10 hover:border-[var(--neon-blue)]/30 cursor-pointer" 
                                                : "bg-black/20 border-white/5 opacity-60"
                                        }`}
                                        onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[var(--neon-blue)] transition-colors">
                                                {lecture.isPreviewFree ? <FaPlay size={14} /> : <FaLock size={14} />}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold group-hover:text-[var(--neon-blue)] transition-colors">
                                                    {lecture.lectureTitle}
                                                </h4>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Module {index + 1}</span>
                                            </div>
                                        </div>
                                        {lecture.isPreviewFree && (
                                            <span className="text-[10px] font-bold text-[var(--neon-blue)] bg-[var(--neon-blue)]/10 px-3 py-1 rounded-md border border-[var(--neon-blue)]/20 uppercase">
                                                Free Preview
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview Player Modal (Simplified as Section) */}
                        {selectedLecture && (
                            <div className="glass-card p-8 rounded-[2.5rem] border border-[var(--neon-blue)]/30 animate-slide-up">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Previewing: {selectedLecture.lectureTitle}</h3>
                                    <button onClick={() => setSelectedLecture(null)} className="text-gray-500 hover:text-white font-bold">Close</button>
                                </div>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                                    {selectedLecture.videoUrl?.includes("youtube.com") || selectedLecture.videoUrl?.includes("youtu.be") ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${selectedLecture.videoUrl.split('v=')[1]?.split('&')[0] || selectedLecture.videoUrl.split('/').pop()}`}
                                            className="w-full h-full"
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video src={selectedLecture.videoUrl} controls className="w-full h-full object-contain" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="glass-card p-10 rounded-[2.5rem] border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-10">Student Reviews</h2>
                            
                            {/* Submit Review */}
                            {!isEnrolled ? (
                                <div className="p-8 bg-black/40 rounded-3xl text-center border border-white/5 mb-10">
                                    <p className="text-gray-500 font-medium italic">Enroll in this course to share your feedback!</p>
                                </div>
                            ) : (
                                <div className="mb-12 space-y-6">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar 
                                                key={star}
                                                onClick={() => setRating(star)} 
                                                className={`text-2xl cursor-pointer transition-all hover:scale-110 ${star <= rating ? "text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" : "text-gray-700"}`} 
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="What did you like about this course?"
                                        className="w-full input-dark rounded-2xl p-6 h-32 resize-none"
                                    />
                                    <button onClick={handleReview} className="px-8 py-4 bg-white text-black font-extrabold rounded-xl hover:bg-[var(--neon-blue)] transition-all shadow-lg active:scale-95">
                                        Post Review
                                    </button>
                                </div>
                            )}

                            {/* Review List */}
                            <div className="space-y-6">
                                {selectedCourseData?.reviews?.length > 0 ? (
                                    selectedCourseData.reviews.map((rev, i) => (
                                        <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex gap-1 text-yellow-500 text-xs">
                                                    {[...Array(rev.rating)].map((_, j) => <FaStar key={j} />)}
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">verified student</span>
                                            </div>
                                            <p className="text-gray-300 font-medium">{rev.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-600 py-10 font-medium italic">No reviews yet. Be the first to review!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-10">
                        {/* Instructor Card */}
                        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 text-center">
                            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">Course Instructor</h4>
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <img 
                                    src={creatorData?.photoUrl || img} 
                                    alt="Instructor" 
                                    className="w-full h-full rounded-full object-cover border-2 border-[var(--neon-blue)] p-1"
                                />
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-black"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{creatorData?.name || "LearnAI Expert"}</h3>
                            <p className="text-gray-400 text-sm font-medium mb-6 line-clamp-3">{creatorData?.description || "Experienced educator dedicated to teaching real-world skills."}</p>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Verified Contact</span>
                                <span className="text-xs text-[var(--neon-blue)] font-bold truncate">{creatorData?.email}</span>
                            </div>
                        </div>

                        {/* More Courses by Creator */}
                        {selectedCreatorCourse.length > 0 && (
                            <div>
                                <h3 className="text-white font-bold mb-6 flex items-center justify-between">
                                    More from {creatorData?.name?.split(' ')[0]}
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">({selectedCreatorCourse.length})</span>
                                </h3>
                                <div className="space-y-6">
                                    {selectedCreatorCourse.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="glass-card p-4 rounded-3xl border border-white/5 hover:border-[var(--neon-blue)]/50 transition-all cursor-pointer group"
                                            onClick={() => navigate(`/viewcourse/${item._id}`)}
                                        >
                                            <div className="flex gap-4">
                                                <img src={item.thumbnail} className="w-20 h-20 rounded-2xl object-cover shrink-0" alt="Thumb" />
                                                <div className="flex flex-col justify-center overflow-hidden">
                                                    <h4 className="text-white font-bold text-sm group-hover:text-[var(--neon-blue)] transition-colors truncate">{item.title}</h4>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">₹{item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCourse
ViewCourse
