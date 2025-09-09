import React from "react";
import {
  GraduationCap,
  ClipboardList,
  Heart,
  ArrowUpRight,
  DollarSign,
  Percent,
  Target,
} from "lucide-react";

const Dashboard = () => {
  const colleges = [
    {
      name: "Standford University",
      location: "California, USA",
      tuition: "$74,029",
      sat: "1470-1570",
      rate: "4%",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_University_seal_2003.svg",
    },
    {
      name: "Standford University",
      location: "California, USA",
      tuition: "$74,029",
      sat: "1470-1570",
      rate: "4%",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_University_seal_2003.svg",
    },
    {
      name: "Standford University",
      location: "California, USA",
      tuition: "$74,029",
      sat: "1470-1570",
      rate: "4%",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_University_seal_2003.svg",
    },
    {
      name: "Standford University",
      location: "California, USA",
      tuition: "$74,029",
      sat: "1470-1570",
      rate: "4%",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_University_seal_2003.svg",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Let’s start your study abroad journey
          </h1>
          <p className="text-sm text-gray-500">
            Complete the following steps to complete your journey
          </p>
        </div>
        <button className="border px-3 py-2 rounded-md text-gray-700 text-sm">
          Select College
        </button>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <p className="font-semibold text-gray-800">Analyze your profile</p>
          <p className="text-sm text-gray-500">
            Assess your potential and know the scope of improvement
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <p className="font-semibold text-gray-800">Build your shortlist</p>
          <p className="text-sm text-gray-500">
            Generate a list of colleges based on your ambition and chances of
            acceptance
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <p className="font-semibold text-gray-800">Manage your shortlist</p>
          <p className="text-sm text-gray-500">
            Evaluate & complete college applications on your shortlist
          </p>
        </div>
      </div>

      {/* Hero card */}
      <div className="mt-6 bg-purple-100 p-6 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Start your college university application with us
          </h2>
          <p className="text-sm text-gray-600">
            Begin your new journey with files
          </p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
            Let’s get started
          </button>
        </div>
        <GraduationCap className="text-purple-600 w-20 h-20" />
      </div>

      {/* Main grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left - Colleges */}
        <div className="col-span-3">
          <h2 className="text-lg font-semibold mb-4">
            Popular colleges you might want to checkout
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colleges.map((c, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 border border-gray-100"
              >
                {/* Top */}
                <div className="flex justify-between items-start mb-4">
                  <img src={c.logo} alt={c.name} className="w-10 h-10" />
                  <div className="flex gap-2">
                    <Heart className="text-purple-500" />
                    <ArrowUpRight className="text-purple-500" />
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-semibold text-gray-800">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.location}</p>

                <hr className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-purple-500 w-4 h-4" />
                    <span>Total Tuition Fees {c.tuition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="text-purple-500 w-4 h-4" />
                    <span>SAT Range {c.sat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent className="text-purple-500 w-4 h-4" />
                    <span>Acceptance Rate {c.rate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Sidebar */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <p className="font-semibold text-gray-800">Pending Tasks</p>
            <p className="text-purple-600 text-2xl font-bold">12</p>
          </div>

          {/* Best Test Scores */}
          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <p className="font-semibold text-gray-800 mb-2">
              Best test scores of this month
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Scope: 7.5</li>
              <li>Exam: IELTS</li>
              <li>Scope: 6.5</li>
              <li>Exam: GRE</li>
              <li>Scope: 7.0</li>
              <li>Exam: SAT</li>
              <li>Scope: 6.0</li>
              <li>Exam: IELTS</li>
            </ul>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <p className="font-semibold text-gray-800 mb-2">Related Articles</p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div className="w-16 h-12 bg-gray-200 rounded"></div>
                <div>
                  <p className="text-sm text-gray-600">
                    Placeholder for the article title...
                  </p>
                  <button className="text-xs text-purple-600">
                    Read article
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
