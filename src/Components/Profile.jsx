import React from "react";
import { Share2, Check } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="w-full">
      {/* Gradient Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-300"></div>

      {/* Profile Content */}
      <div className="bg-white relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 pb-6">
          {/* Left Side - Profile Image and Info */}
          <div className="flex items-center gap-4 -mt-16">
            {/* Profile Image */}
            <div className="relative">
              <img
                src="/profile.jpg" // replace with your profile image path
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white object-cover"
              />
              {/* Verified Badge */}
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Name and Email */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Mitchelle Johnson
              </h1>
              <p className="text-gray-500">mitchelle_johnson200@gmail.com</p>
            </div>
          </div>

          {/* Right Side - Share Profile Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            <Share2 className="w-4 h-4" />
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );
}
