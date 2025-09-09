import React from "react";

const InfoBanner = ({ title, buttonText, onButtonClick }) => {
  return (
    <div className="flex items-center justify-between w-full px-2 md:px-4 py-3 mt-10">
      {/* Title */}
      <h2 className="text-gray-800 font-semibold text-lg md:text-2xl">
        {title}
      </h2>

      {/* Button */}
      <button
        onClick={onButtonClick}
        className="text-sm md:text-base text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default InfoBanner;
