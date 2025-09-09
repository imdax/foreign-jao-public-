import React, { useState } from "react";

// --- Mock Data ---
// In a real application, this data would likely come from an API
const initialTasks = [
  {
    id: 1,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Pending",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Dianne Russell",
      email: "felicia.reid@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=DR",
    },
  },
  {
    id: 2,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Completed",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Eleanor Pena",
      email: "curtis.weaver@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=EP",
    },
  },
  {
    id: 3,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Pending",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Devon Lane",
      email: "jackson.graham@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=DL",
    },
  },
  {
    id: 4,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Pending",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Dianne Russell",
      email: "deanna.curtis@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=DR",
    },
  },
  {
    id: 5,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Pending",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Wade Warren",
      email: "tanya.hill@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=WW",
    },
  },
  {
    id: 6,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Completed",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Marvin McKinney",
      email: "georgia.young@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=MM",
    },
  },
  {
    id: 7,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Completed",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Albert Flores",
      email: "sara.cruz@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=AF",
    },
  },
  {
    id: 8,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Yet to be reviewed",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Wade Warren",
      email: "tanya.hill@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=WW",
    },
  },
  {
    id: 9,
    title: "Submit Aadhar copy",
    description:
      "This is going to be the description placeholder where the admin the documents or how the task is needs to be done",
    status: "Completed",
    date: "22 Jan 2024",
    assignedTo: {
      name: "Marvin McKinney",
      email: "georgia.young@example.com",
      avatar: "https://placehold.co/40x40/E2E8F0/4A5568?text=MM",
    },
  },
];

// --- Helper Components ---

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-orange-100 text-orange-700",
    "Yet to be reviewed": "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

// Icon Components (using inline SVG for portability)
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Main Component
const Task = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDelete = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-start justify-center min-h-screen">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b-1 border-gray-200">
                <th className="p-3 text-left font-semibold">
                  Task Description
                </th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Assigned on</th>
                <th className="p-3 text-left font-semibold">Assigned By</th>
                <th className="p-3 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="p-3 align-top">
                    <div className="font-semibold text-gray-800">
                      {task.title}
                    </div>
                    <div className="text-gray-500 mt-1">{task.description}</div>
                  </td>
                  <td className="p-3 align-middle">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="p-3 align-middle text-gray-600">
                    {task.date}
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex items-center gap-2">
                      <img
                        src={task.assignedTo.avatar}
                        alt={task.assignedTo.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/32x32/E2E8F0/4A5568?text=U";
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {task.assignedTo.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.assignedTo.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex items-center gap-3">
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <UploadIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="text-xs text-gray-600">Page 1 of 10</div>
        </div>
      </div>
    </div>
  );
};

export default Task;
