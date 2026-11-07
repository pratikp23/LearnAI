import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, category, price, id, reviews }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      className="max-w-sm w-full bg-white rounded-2xl overflow-hidden cursor-pointer group relative border border-[#EEEEF2] hover:border-[#DDD6FE] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(91,33,182,0.08)] hover:-translate-y-1"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Thumbnail Area */}
      <div className="relative h-52 overflow-hidden bg-[#FAFAFC]">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800" : (thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800")}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category Tag */}
        <span className="absolute top-3.5 right-3.5 px-3 py-1 bg-white/95 backdrop-blur-md text-[11px] font-extrabold text-[#5B21B6] rounded-full uppercase tracking-wider border border-[#DDD6FE] shadow-sm">
          {category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h2 className="text-lg font-bold text-[#171717] leading-snug min-h-[3rem] line-clamp-2 group-hover:text-[#5B21B6] transition-colors">
          {title}
        </h2>

        {/* Footer info */}
        <div className="flex justify-between items-center pt-3 border-t border-[#EEEEF2]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider mb-0.5">Price</span>
            <span className="font-black text-2xl text-[#5B21B6]">
              ₹{price || 0}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider mb-0.5">Rating</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF3E8] rounded-full border border-[#FED7AA]">
              <FaStar className="text-[#FC8019] text-xs" />
              <span className="text-xs font-bold text-[#FC8019]">{avgRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
