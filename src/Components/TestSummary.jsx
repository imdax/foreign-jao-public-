import React from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TestSummary = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Computation Engineering",
        data: [300, 350, 280, 260, 250, 270, 260, 280, 300, 310, 320, 290],
        backgroundColor: "#9B8AFB",
      },
      {
        label: "UX Design",
        data: [250, 300, 230, 220, 210, 230, 220, 240, 260, 270, 280, 250],
        backgroundColor: "#BFAEFD",
      },
      {
        label: "Machine Learning",
        data: [300, 350, 280, 260, 250, 270, 260, 280, 300, 310, 320, 290],
        backgroundColor: "#7C66F1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 200 },
      },
    },
  };

  // Progress bar widths (in percentage)
  const progressData = {
    open: 60, // Example value
    passed: (45 / 56) * 100,
    failed: (11 / 56) * 100,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Average Score */}
      <h1 className="text-lg">
        Your average score is{" "}
        <span className="text-purple-600 font-semibold">85.67%</span>
      </h1>
      <p className="text-sm text-gray-500">
        View your score record & apply for new tests
      </p>

      {/* Stats with progress bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Open Tests */}
        <div className="bg-purple-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-bold text-lg">124</p>
              <p className="text-gray-600">Open Tests</p>
            </div>
            <ClipboardList className="text-purple-600" size={32} />
          </div>
          <div className="w-full h-2 bg-purple-200 rounded-full mt-3">
            <div
              className="h-2 bg-purple-600 rounded-full"
              style={{ width: `${progressData.open}%` }}
            ></div>
          </div>
        </div>

        {/* Passed Tests */}
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-bold text-lg">45/56</p>
              <p className="text-gray-600">Passed Tests</p>
            </div>
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <div className="w-full h-2 bg-green-200 rounded-full mt-3">
            <div
              className="h-2 bg-green-600 rounded-full"
              style={{ width: `${progressData.passed}%` }}
            ></div>
          </div>
        </div>

        {/* Failed Tests */}
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-bold text-lg">11/56</p>
              <p className="text-gray-600">Failed Tests</p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
          <div className="w-full h-2 bg-red-200 rounded-full mt-3">
            <div
              className="h-2 bg-red-600 rounded-full"
              style={{ width: `${progressData.failed}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* New Events */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">New events are live.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow">
              <FileText className="text-purple-500 mb-2" size={28} />
              <h3 className="font-semibold">Machine Learning Monthly Test</h3>
              <p className="text-gray-500 text-sm mt-1">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
                pariatur, ipsum similique veniam.
              </p>
              <button className="mt-4 text-purple-600 flex items-center gap-1 font-medium">
                Start Test <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-10 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Test Results</h2>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TestSummary;
