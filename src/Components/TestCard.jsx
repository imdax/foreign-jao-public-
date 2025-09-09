import React from "react";
import { Clock, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TestCard({
  _id,
  name = "Test Name",
  description = "Test description goes here...",
  time = 30,
  questions = 0,
}) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/test/${_id}`); // go to TestPaper with testId
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-80 border border-gray-100">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
          <BookOpen className="text-purple-600 w-6 h-6" />
        </div>
        <FileText className="text-purple-500" />
      </div>

      {/* Test Title */}
      <h2 className="text-lg font-semibold text-gray-800 mt-3">{name}</h2>
      <p className="text-sm text-gray-500 mb-3">{description}</p>

      <hr className="my-3 bg-gray-200" />

      {/* Test Info */}
      <div className="space-y-2 text-sm text-gray-700 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-purple-500 w-4 h-4" />
          <span>Time Limit: {time} mins</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="text-purple-500 w-4 h-4" />
          <span>Total Questions: {questions}</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Start Test
      </button>
    </div>
  );
}
