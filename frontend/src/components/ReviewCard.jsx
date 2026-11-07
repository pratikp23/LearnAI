import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="glass-card p-6 rounded-2xl max-w-sm w-full relative group border border-[var(--glass-border)] shadow-md">
      {/* ⭐ Rating Stars */}
      <div className="flex items-center mb-4 text-amber-500 text-sm gap-1">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>
              {i < rating ? <FaStar /> : <FaRegStar className="text-gray-300" />}
            </span>
          ))}
      </div>

      {/* 💬 Review Text */}
      <p className="text-[var(--body-text)] text-sm mb-6 leading-relaxed italic border-l-3 border-[var(--deep-green)] pl-4">
        "{text}"
      </p>

      {/* 👤 Reviewer Info */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-r from-[var(--deep-green)] to-[var(--neon-blue)] shrink-0 shadow-sm">
          {image ? (
            <img
              src={image}
              alt={name}
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          ) : null}
          <div className={`w-full h-full bg-[#3E5F44] rounded-full flex items-center justify-center text-white font-bold text-sm ${image ? 'hidden' : 'flex'}`}>
            {name ? name.slice(0, 1).toUpperCase() : "U"}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-[var(--dark-brown)] text-base">{name}</h4>
          <p className="text-xs text-[var(--deep-green)] font-bold uppercase tracking-wider">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
