import React from "react";
import { Check } from "lucide-react";

const Stepper = ({ currentStep = 2 }) => {
  const steps = [
    {
      title: "Analyze your profile",
      description: "Assess your profile and know the scope of improvement",
    },
    {
      title: "Build your shortlist",
      description:
        "Generate a list of colleges based upon your interest and higher chances of acceptance",
    },
    {
      title: "Manage your shortlist",
      description: "Evaluate & compare colleges on your shortlist",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Line wrapper */}
      <div className="relative flex justify-between items-center">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />

        {/* Active line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-purple-500 -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={index} className="flex flex-col items-center w-1/3">
              {/* Circle */}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center mb-3 ${
                  isCompleted
                    ? "bg-purple-500 text-white"
                    : isActive
                    ? "bg-white border-2 border-purple-500"
                    : "bg-gray-300"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                ) : null}

                {isActive && (
                  <div className="absolute w-12 h-12 rounded-full bg-purple-100 -z-10" />
                )}
              </div>

              {/* Text */}
              <h4
                className={`font-medium text-sm ${
                  isActive
                    ? "text-purple-700"
                    : isCompleted
                    ? "text-gray-800"
                    : "text-gray-800"
                }`}
              >
                {step.title}
              </h4>
              <p
                className={`text-xs leading-tight mt-1 ${
                  isActive ? "text-purple-600" : "text-gray-600"
                }`}
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
