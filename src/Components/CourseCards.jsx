import React from "react";

const courses = [
  { img: "/assets/img1.png" },
  { img: "/assets/img2.png" },
  { img: "/assets/img3.png" },
  { img: "/assets/img4.png" },
  { img: "/assets/img5.png" },
  { img: "/assets/img6.png" },
];

export default function CourseCards() {
  return (
    <div className="px-6 py-8">
      <h2 className="text-lg font-semibold mb-6">UX Design</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
          >
            {/* Thumbnail */}
            <img
              src={course.img}
              alt="Course Thumbnail"
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900 leading-snug">
                Masters in UX Design - Professor Michael Stark
              </h3>

              {/* Instructor */}
              <div className="flex items-center mt-3">
                <span className="text-sm text-gray-500 mr-1">
                  Instructed By:
                </span>
                <img
                  src="/assets//assets/Avatar.png"
                  alt="Instructor"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm font-medium text-gray-900">
                  Olivia Rhye
                </span>
              </div>

              {/* Session Info */}
              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center text-xs font-medium text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Live Session
                </span>

                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5V4H2v16h5m10 0v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0h-4"
                    />
                  </svg>
                  154 Students
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span></span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
