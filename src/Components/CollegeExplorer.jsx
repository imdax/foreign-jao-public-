import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const CollegeExplorer = () => {
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [selectedUniversity, setSelectedUniversity] = useState("Universities");

  return (
    <div className="p-6 rounded-lg">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Explore & find best college for you
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Complete the following steps to complete your journey
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <button
              onClick={() => setIsVerifiedOnly(!isVerifiedOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isVerifiedOnly ? "bg-purple-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isVerifiedOnly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <span className="text-gray-800 text-sm font-medium">
            Only Verified colleges
          </span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-4">
        <span className="text-gray-800 font-medium">Filters:</span>

        {/* Country Dropdown */}
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Country">Country</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Universities Dropdown */}
        <div className="relative">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Universities">Universities</option>
            <option value="Stanford">Stanford</option>
            <option value="Harvard">Harvard</option>
            <option value="MIT">MIT</option>
            <option value="Yale">Yale</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default CollegeExplorer;
