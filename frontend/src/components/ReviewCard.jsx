import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="bg-white p-6 rounded-2xl max-w-sm w-full relative group border border-[#EEEEF2] hover:border-[#DDD6FE] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(91,33,182,0.08)] transition-all">
      {/* ⭐ Rating Stars */}
      <div className="flex items-center mb-4 text-[#FC8019] text-sm gap-1">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>
              {i < rating ? <FaStar /> : <FaRegStar className="text-gray-200" />}
            </span>
          ))}
      </div>

      {/* 💬 Review Text */}
      <p className="text-[#666666] text-sm mb-6 leading-relaxed italic border-l-3 border-[#5B21B6] pl-4 font-medium">
        "{text}"
      </p>

      {/* 👤 Reviewer Info */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] shrink-0 shadow-sm">
          {image ? (
            <img
              src={image}
              alt={name}
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          ) : null}
          <div className={`w-full h-full bg-[#5B21B6] rounded-full flex items-center justify-center text-white font-bold text-sm ${image ? 'hidden' : 'flex'}`}>
            {name ? name.slice(0, 1).toUpperCase() : "U"}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-[#171717] text-base">{name}</h4>
          <p className="text-xs text-[#5B21B6] font-extrabold uppercase tracking-wider">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
