import React from "react";
import Intro from "../Components/Intro";
import Progbar from "../Components/Progbar";
import InfoBanner from "../Components/InfoBanner";
import ApplicationCard from "../Components/ApplicationCard";
import Universities from "../Components/Universities";
import StudentProfile from "../Components/StudentProfile";
import Ds from "../Components/Ds";

function Dashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT (Intro + Progress + main content) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Row 1: Intro */}
          <Intro />

          {/* Progress bar */}
          <Progbar />

          <ApplicationCard />
          <InfoBanner
            title="Popular colleges you might want to checkout"
            buttonText="Explore More"
          />
          <Universities />
          <InfoBanner
            title="Student profiles which are related to you"
            buttonText="Explore Community"
          />
          <StudentProfile />
        </div>

        {/* RIGHT COLUMN (Button on top, then sidebar cards) */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          {/* Top-right button */}
          {/* Top-right select dropdown */}
          <div className="flex justify-end">
            <select className="w-40 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-800 font-medium shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <option>Select College</option>
              <option>Harvard</option>
              <option>Stanford</option>
              <option>MIT</option>
              <option>Oxford</option>
            </select>
          </div>

          {/* Sidebar cards below */}
          <Ds />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
