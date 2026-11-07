import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaFilter, FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import aiIcon from "../assets/SearchAi.png";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setCourseData } from "../redux/courseSlice.js";
import Card from "../components/Card.jsx";
import { ClipLoader } from "react-spinners";

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourses, setFilterCourses] = useState([]);
  const { courseData } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Web Development", "App Development", "AI/ML", "Data Science", 
    "Data Analytics", "Ethical Hacking", "UI UX Designing", "Others"
  ];

  const toggleCategory = (cat) => {
    setCategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/course/getpublishedcoures`, { withCredentials: true });
        dispatch(setCourseData(res.data));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch]);

  useEffect(() => {
    let results = (courseData || []).filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (category.length > 0) {
      results = results.filter(course => category.includes(course.category));
    }
    setFilterCourses(results);
  }, [courseData, category, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717]">
      <Nav />
      
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#5B21B6] text-white rounded-full shadow-2xl md:hidden"
      >
        <FaFilter size={20} />
      </button>

      <div className="flex pt-24">
        {/* Sidebar */}
        <aside className={`
          fixed top-24 left-0 h-[calc(100vh-6rem)] w-72 bg-white border-r border-[#EEEEF2] p-8 transition-transform duration-300 z-40 shadow-sm
          ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}>
          <div className="flex items-center gap-3 mb-8 text-[#666666] hover:text-[#5B21B6] cursor-pointer transition-colors" onClick={() => navigate("/")}>
            <FaArrowLeftLong />
            <span className="font-extrabold uppercase tracking-wider text-xs">Back to Home</span>
          </div>

          <button 
            onClick={() => navigate("/searchwithai")}
            className="w-full mb-8 p-3.5 bg-[#F5F0FF] rounded-2xl flex items-center justify-center gap-3 border border-[#DDD6FE] hover:border-[#7C3AED] transition-all group shadow-sm"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#7C3AED]/40 group-hover:scale-105 transition-transform">
                <img src={aiIcon} alt="AI" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-sm text-[#5B21B6]">Search with AI</span>
          </button>

          <h2 className="text-xs font-black uppercase tracking-wider text-[#666666] mb-4 px-2">Filter Categories</h2>
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <label 
                key={cat}
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                  ${category.includes(cat) ? 'bg-[#F5F0FF] border-[#DDD6FE] text-[#5B21B6]' : 'hover:bg-gray-50 border-transparent text-[#666666]'}
                `}
                onClick={() => toggleCategory(cat)}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${category.includes(cat) ? 'bg-[#5B21B6] border-[#5B21B6]' : 'border-gray-300'}`}>
                    {category.includes(cat) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-sm font-bold">{cat}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 p-8 lg:p-12">
          {/* Header & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-black text-[#171717] mb-2">Explore Courses</h1>
              <p className="text-[#666666] font-medium">Discover your next skill from our curated library</p>
            </div>
            
            <div className="relative group max-w-md w-full">
              <FaMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5B21B6] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by title or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-[#EEEEF2] rounded-2xl focus:outline-none focus:border-[#7C3AED] transition-all text-[#171717] placeholder:text-gray-400 font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <ClipLoader color="#5B21B6" size={40} />
                <span className="text-[#5B21B6] font-bold uppercase tracking-widest text-xs">Loading Catalog...</span>
            </div>
          ) : filterCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
              {filterCourses.map((course) => (
                <Card 
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  thumbnail={course.thumbnail}
                  category={course.category}
                  price={course.price}
                  reviews={course.reviews}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white rounded-3xl border border-[#EEEEF2] shadow-sm">
              <div className="w-20 h-20 bg-[#F5F0FF] rounded-full flex items-center justify-center mx-auto mb-6 text-[#5B21B6]">
                <FaMagnifyingGlass size={30} />
              </div>
              <h2 className="text-2xl font-bold text-[#171717] mb-2">No Courses Found</h2>
              <p className="text-[#666666] font-medium">Try adjusting your filters or search query</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllCourses;
