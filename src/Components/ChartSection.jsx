import React from "react";
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

const ChartSection = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Computation Engineering",
        data: [300, 350, 280, 260, 250, 270],
        backgroundColor: "#9B8AFB",
      },
      {
        label: "UX Design",
        data: [250, 300, 230, 220, 210, 230],
        backgroundColor: "#BFAEFD",
      },
      {
        label: "Machine Learning",
        data: [300, 350, 280, 260, 250, 270],
        backgroundColor: "#7C66F1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ lets us control height
    plugins: { legend: { position: "top" } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 100 } },
    },
  };

  return (
    <div className="mt-10 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Monthly Test Results</h2>
      {/* ✅ Fixed height container */}
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartSection;
