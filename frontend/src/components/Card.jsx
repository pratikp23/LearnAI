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
      className="max-w-sm w-full glass-card rounded-[2rem] overflow-hidden cursor-pointer group relative border border-[var(--glass-border)] hover:border-[var(--neon-blue)]/50 transition-all duration-500 shadow-xl"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Thumbnail Area */}
      <div className="relative h-52 overflow-hidden bg-black/10">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800" : (thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800")}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Tag */}
        <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md text-[11px] font-black text-[var(--deep-green)] rounded-lg uppercase tracking-wider border border-[var(--neon-blue)]/30 shadow-md">
          {category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4 relative">
        {/* Title */}
        <h2 className="text-xl font-extrabold text-[var(--dark-brown)] leading-tight min-h-[3.5rem] line-clamp-2 group-hover:text-[var(--deep-green)] transition-colors duration-300">
          {title}
        </h2>

        {/* Footer info */}
        <div className="flex justify-between items-center pt-4 border-t border-[var(--glass-border)]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[var(--accent-color)] font-bold uppercase tracking-wider mb-1">Price</span>
            <span className="font-black text-2xl text-[var(--deep-green)] transition-colors">
              ₹{price || 0}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[var(--accent-color)] font-bold uppercase tracking-wider mb-1">Rating</span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-[var(--glass-border)] shadow-sm">
              <FaStar className="text-amber-500 text-xs" />
              <span className="text-xs font-black text-[var(--dark-brown)]">{avgRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
