import React from "react";
import { ChevronDown, Link2 } from "lucide-react";

const QandASection = () => {
  const questions = Array.from({ length: 7 }, () => ({
    name: "Lana Steiner",
    time: "7 days ago",
    text: "This is going to be the placeholder for the question which will be asked by student in Q&A section",
  }));

  return (
    <div className="bg-white rounded-2xl shadow p-6 ml-70 mr-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold">Q & A</h2>
        <div className="flex items-center border rounded-lg px-3 py-1 text-sm text-gray-600 cursor-pointer">
          Last 7 Days
          <ChevronDown size={16} className="ml-1" />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        View & learn through the questions which has been asked by another
        students
      </p>

      {/* Scrollable List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {questions.map((q, index) => (
          <div key={index} className="flex gap-3">
            {/* Avatar */}
            <img
              src="/assets/profile.png"
              alt={q.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {/* Content */}
            <div>
              <p className="text-sm font-medium text-gray-800">
                {q.name} <span className="text-xs text-gray-500">{q.time}</span>
              </p>
              <p className="text-sm text-gray-600">{q.text}</p>
              <a
                href="#"
                className="text-sm text-purple-600 font-medium mt-1 inline-block"
              >
                Read More
              </a>
              <div className="mt-1 text-gray-400">
                <Link2 size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QandASection;
