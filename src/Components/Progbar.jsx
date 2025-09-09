import React from "react";

function Progbar() {
  return (
    <div className="w-full px-2 py-6">
      {/* Progress Container */}
      <div className="relative">
        {/* Line background */}
        <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200 z-0 rounded-full" />

        {/* Line progress */}
        <div className="absolute top-3 left-0 w-2/3 h-0.5 bg-purple-500 z-10 rounded-full" />

        {/* Steps */}
        <div className="grid grid-cols-3 text-center relative z-20">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-purple-500 rounded-full ring-4 ring-purple-100 flex items-center justify-center text-white mb-2 text-xs">
              ✓
            </div>
            <h4 className="font-medium text-gray-800 text-sm">
              Analyze your profile
            </h4>
            <p className="text-gray-600 text-xs leading-tight mt-1">
              Assess your profile and know <br />
              the scope of improvement
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-purple-500 rounded-full ring-4 ring-purple-100 mb-2" />
            <h4 className="font-medium text-purple-700 text-sm">
              Build your shortlist
            </h4>
            <p className="text-purple-600 text-xs leading-tight mt-1">
              Generate a list of colleges based upon your interest <br />
              and higher chances of acceptance
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full mb-2" />
            <h4 className="font-medium text-gray-800 text-sm">
              Manage your shortlist
            </h4>
            <p className="text-gray-600 text-xs leading-tight mt-1">
              Evaluate & compare colleges on <br />
              your shortlist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progbar;
