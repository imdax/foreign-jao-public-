import React from "react";

const ApplicationCard = () => {
  return (
    <div className="bg-purple-100 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-md w-full mt-6">
      {/* Left side (Text + Button) */}
      <div className="flex-1 md:pr-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          Start your college university application with us
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Begin your new journey with this
        </p>
        <button className="mt-4 bg-purple-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-purple-500 transition">
          Let&apos;s get started
        </button>
      </div>

      {/* Right side (Image) */}
      <div className="flex-shrink-0 mt-6 md:mt-0">
        <img
          src="/assets/application.png"
          alt="College Application"
          className="w-48 md:w-64 lg:w-72 h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default ApplicationCard;
