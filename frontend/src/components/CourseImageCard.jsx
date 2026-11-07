import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseImageCard = ({ thumbnail, title, id }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="w-full cursor-pointer group bg-white border border-[#EEEEF2] hover:border-[#7C3AED]/40 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="w-full overflow-hidden rounded-xl bg-[#FAFAFC]">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-3 text-sm font-bold text-[#171717] group-hover:text-[#5B21B6] truncate transition-colors">
        {title}
      </h3>
    </div>
  );
};

export default CourseImageCard;
