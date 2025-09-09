import React, { useEffect, useRef } from "react";
import { Share2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfileHeader({ student }) {
  const prevStudentRef = useRef(null);

  useEffect(() => {
    if (
      prevStudentRef.current &&
      student &&
      (student.name !== prevStudentRef.current.name ||
        student.email !== prevStudentRef.current.email)
    ) {
      toast.success("Profile updated successfully!");
    }
    prevStudentRef.current = student;
  }, [student]);

  return (
    <div className="w-full">
      {/* ✅ Full-width Gradient Banner */}
      <div className="absolute left-0 top-0 w-full h-40 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-300"></div>

      {/* ✅ Profile Content (centered) */}
      <div className="relative max-w-6xl mx-auto px-6 pt-40">
        <div className="flex justify-between items-center -mt-16">
          {/* Left Side - Profile Image + Info */}
          <div className="flex items-center gap-4">
            {/* Profile Image */}
            <div className="relative">
              <img
                src="/assets/ProfileCard.png"
                alt="Profile"
                className="w-36 h-36 rounded-full"
              />
            </div>

            {/* Name and Email */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900">
                {student?.name || "Your Name"}
              </h1>
              <p className="text-gray-500">
                {student?.email || "your@email.com"}
              </p>
            </div>
          </div>

          {/* ✅ Right Side - Share Profile Button (aligned with email) */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition self-center">
            <Share2 className="w-4 h-4" />
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );
}
