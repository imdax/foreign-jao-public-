import React from "react";
import { Heart, DollarSign, BadgeCheck, Percent } from "lucide-react";

// ✅ Direct public paths (no import)
const placeholderLogo = "/assets/university-placeholder.png";
const flagIcon = "/assets/US.png";

const UniversityCard = ({
  logoUrl,
  name = "Sample University",
  location = "Unknown Location 🌍",
  tuition = "$25,000",
  satRange = "1200-1400",
  acceptanceRate = "50%",
  onViewDetails, // ✅ added prop
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-6 w-full max-w-xl mx-auto">
      <div className="flex items-start justify-between">
        {/* Logo + Name */}
        <div className="flex flex-col items-start gap-2">
          <img
            src={logoUrl || placeholderLogo}
            alt={name}
            className="w-10 h-10 rounded-full border border-gray-300"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholderLogo; // ✅ fallback if broken
            }}
          />
          <div>
            <h2 className="text-lg font-semibold mb-1">{name}</h2>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <img src={flagIcon} alt="Flag" className="w-5 h-5 rounded-full" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button className="text-purple-500 hover:text-purple-700">
            <Heart size={24} />
          </button>
          <button
            onClick={onViewDetails} // ✅ trigger navigation
            className="bg-white border border-gray-200 rounded-lg px-4 py-1 text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 mt-2">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-purple-500">
            <DollarSign size={20} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Total Tuition Fees</span>
              <span className="font-medium text-gray-700">{tuition}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-500">
            <BadgeCheck size={20} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">SAT Range</span>
              <span className="font-medium text-gray-700">{satRange}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-500">
            <Percent size={20} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Acceptance Rate</span>
              <span className="font-medium text-gray-700">
                {acceptanceRate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
