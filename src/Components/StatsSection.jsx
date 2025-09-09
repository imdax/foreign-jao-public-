import React from "react";
import { ClipboardList, CheckCircle2, XCircle } from "lucide-react";

const StatsSection = ({ summary, totalTests }) => {
  if (!summary) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No test summary available
      </p>
    );
  }

  const taken = summary.testsTaken || 0;
  const passed = summary.passCount || 0;
  const failed = summary.failCount || 0;
  const total = totalTests || 0;

  const progressData = {
    taken: total > 0 ? (taken / total) * 100 : 0,
    passed: taken > 0 ? (passed / taken) * 100 : 0,
    failed: taken > 0 ? (failed / taken) * 100 : 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Tests Taken */}
      <div className="bg-purple-100 p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 font-bold text-lg">
              {taken}/{total}
            </p>
            <p className="text-gray-600">Tests Taken</p>
          </div>
          <ClipboardList className="text-purple-600" size={32} />
        </div>
        <div className="w-full h-2 bg-purple-200 rounded-full mt-3">
          <div
            className="h-2 bg-purple-600 rounded-full"
            style={{ width: `${progressData.taken}%` }}
          ></div>
        </div>
      </div>

      {/* Passed */}
      <div className="bg-green-100 p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 font-bold text-lg">
              {passed}/{taken}
            </p>
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

      {/* Failed */}
      <div className="bg-red-100 p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-600 font-bold text-lg">
              {failed}/{taken}
            </p>
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
  );
};

export default StatsSection;
