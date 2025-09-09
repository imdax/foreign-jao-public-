// src/components/UniCard.jsx
import React from "react";
import { DollarSign, Target, Heart, ExternalLink, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ Use direct paths from public/assets
const placeholderLogo = "/assets/university-placeholder.png";
const locationIcon = "/assets/US.png";

const UniCard = ({
  id, // <-- college id from API
  logoUrl,
  name,
  location,
  tuition,
  satRange,
  acceptanceRate,
}) => {
  const navigate = useNavigate();

  const openInNewTab = () => {
    if (!id) return;
    const url = `${window.location.origin}/colleges/${encodeURIComponent(id)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openInApp = () => {
    if (!id) return;
    navigate(`/colleges/${id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-5 w-full max-w-85 relative cursor-pointer hover:shadow-lg transition"
      onClick={(e) => {
        if (e.target.closest("button")) return; // prevent button clicks from triggering
        openInApp();
      }}
    >
      {/* Top Row: Logo and Action Icons */}
      <div className="flex justify-between items-center mb-4">
        {/* ✅ Circle background around logo */}
        <div className="w-12 h-12 rounded-full border-1 border-gray-300 flex items-center justify-center overflow-hidden">
          <img
            src={logoUrl || placeholderLogo}
            alt={name}
            className="w-8 h-8 object-contain"
            onError={(e) => (e.currentTarget.src = placeholderLogo)}
          />
        </div>

        <div className="flex gap-3 items-center">
          <button
            className="text-purple-500 hover:text-purple-700 p-1"
            aria-label="Favorite"
            title="Save to favorites"
            onClick={(e) => {
              e.stopPropagation();
              console.log("favorite clicked for", id);
            }}
          >
            <Heart size={20} />
          </button>

          {/* ✅ ExternalLink now opens CollegeDetails in new tab */}
          <button
            className="border border-dashed border-gray-300 rounded-full p-1"
            aria-label="Open college details"
            title="Open in new tab"
            onClick={(e) => {
              e.stopPropagation();
              openInNewTab();
            }}
          >
            <ExternalLink size={18} className="text-purple-500" />
          </button>
        </div>
      </div>

      {/* University Name and Location */}
      <h2
        className="text-lg font-semibold mb-1"
        onClick={(e) => {
          e.stopPropagation();
          openInApp();
        }}
      >
        {name}
      </h2>
      <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
        <img src={locationIcon} alt="Location" className="w-4 h-4" />
        {location || "Location not available"}
      </p>

      <hr className="mb-4 border-t border-gray-200" />

      {/* Tuition Fees */}
      <div className="flex items-start gap-3 mb-3">
        <DollarSign className="text-purple-500 mt-1" />
        <div>
          <p className="text-sm text-gray-400">Total Tuition Fees</p>
          <p className="font-semibold text-gray-900">{tuition || "N/A"}</p>
        </div>
      </div>

      {/* SAT Range */}
      <div className="flex items-start gap-3 mb-3">
        <Target className="text-purple-500 mt-1" />
        <div>
          <p className="text-sm text-gray-400">SAT Range</p>
          <p className="font-semibold text-gray-900">{satRange || "N/A"}</p>
        </div>
      </div>

      {/* Acceptance Rate */}
      <div className="flex items-start gap-3">
        <Percent className="text-purple-500 mt-1" />
        <div>
          <p className="text-sm text-gray-400">Acceptance Rate</p>
          <p className="font-semibold text-gray-900">
            {acceptanceRate || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UniCard;
