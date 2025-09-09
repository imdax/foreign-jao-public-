import React, { useState } from "react";
import { DollarSign, Target, Heart, MapPin, Globe } from "lucide-react";

// Reusable component for each info item in the overview section
const InfoCard = ({ icon: Icon, label, value, iconColor }) => (
  <div className="flex items-start space-x-4">
    <div className={`p-3 rounded-full bg-purple-100 ${iconColor}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

// Sidebar navigation component
const Sidebar = ({ activeItem, setActiveItem }) => {
  const navItems = [
    "Overview",
    "Cost & Scholarships",
    "Application",
    "Academics",
    "Students",
    "Similar Colleges",
  ];

  return (
    <nav className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveItem(item);
              }}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                activeItem === item
                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Main content area for the overview details
const OverviewContent = () => {
  const overviewData = [
    {
      icon: DollarSign,
      label: "Total Tuition Fees",
      value: "$74,029",
      iconColor: "text-purple-600",
    },
    {
      icon: Target,
      label: "SAT Range",
      value: "1470-1570",
      iconColor: "text-purple-600",
    },
    {
      icon: Heart,
      label: "Acceptance Rate",
      value: "4%",
      iconColor: "text-purple-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "123, ABC Road, USA",
      iconColor: "text-purple-600",
    },
    {
      icon: Globe,
      label: "Website",
      value: "www.stanford.com",
      iconColor: "text-purple-600",
    },
    {
      icon: Target,
      label: "ACT Range",
      value: "34-36",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="flex-1 bg-white p-8 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      <p className="mt-1 text-gray-500">
        View all the basic details of the college
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {overviewData.map((item, index) => (
          <InfoCard
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
            iconColor={item.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

// This is the main component you can render
export default function Overview() {
  // useState hook to keep track of the active navigation item
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <div className=" bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Pass the state and the function to update it down to the Sidebar */}
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        {/* Here you could conditionally render different content based on activeItem */}
        {activeItem === "Overview" && <OverviewContent />}
        {/* Example for another section */}
        {/* {activeItem === 'Cost & Scholarships' && <CostContent />} */}
      </div>
    </div>
  );
}
