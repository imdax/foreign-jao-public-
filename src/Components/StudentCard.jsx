// src/components/UniversityCard.jsx
import React from "react";
import { DollarSign, Target, Heart, ExternalLink } from "lucide-react";

const StudentCard = ({ logo, name, location, Gre, Toefl, UGgpa }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-85 relative ">
      {/* Top Row: Logo and Action Icons */}
      <div className="flex justify-between items-center mb-4">
        <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
        <div className="flex gap-3 items-center">
          <button className="text-purple-500 hover:text-purple-700">
            <Heart size={20} />
          </button>
          <button className="border border-dashed border-gray-300 rounded-full p-1">
            <ExternalLink size={18} className="text-purple-500" />
          </button>
        </div>
      </div>

      {/* University Name and Location */}
      <h2 className="text-lg font-semibold mb-1">{name}</h2>
      <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
        🇺🇸 {location}
      </p>

      <hr className="mb-4 border-t border-gray-200" />

      {/* Tuition Fees */}
      <div className="flex items-start gap-3 mb-3 ">
        <DollarSign className="text-purple-500 mt-1" />
        <div>
          <p className="text-sm text-gray-400">GRE</p>
          <p className="font-semibold text-gray-900">{Gre}</p>
        </div>
      </div>

      {/* SAT Range */}
      <div className="flex items-start gap-3 mb-3">
        <Target className="text-purple-500 mt-1" />
        <div>
          <p className="text-sm text-gray-400">Toefl</p>
          <p className="font-semibold text-gray-900">{Toefl}</p>
        </div>
      </div>

      {/* Acceptance Rate */}
      <div className="flex items-start gap-3">
        <Heart className="text-purple-500 mt-1" />
        <div>
          <p className="text-sm text-gray-400">UG GPA</p>
          <p className="font-semibold text-gray-900">{UGgpa}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
