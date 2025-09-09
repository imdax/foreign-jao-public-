import React, { useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import { FileText, CheckCircle2, XCircle } from "lucide-react";
import API_BASE from "../config";
const TestScoreCard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const studentId = localStorage.getItem("studentID");
    const token = localStorage.getItem("token");

    if (!studentId) {
      setError("No student ID found in localStorage");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        console.log("Fetching report for student:", studentId);

        const res = await fetch(
          `${API_BASE}/testReports/by-student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // if your API requires token
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        if (data?.ok && data?.data?.summary) {
          setSummary(data.data.summary);
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching test report:", err);
        setError(err.message || "Failed to load test report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <CardContainer>
      <h3 className="text-sm font-medium text-gray-800 mb-2">Test Report</h3>
      <hr className="border-t border-gray-200 mb-2" />

      {loading ? (
        <p className="text-xs text-gray-400">Loading report...</p>
      ) : error ? (
        <p className="text-xs text-red-500">Error: {error}</p>
      ) : summary ? (
        <div className="space-y-3">
          {/* Tests Taken */}
          <div className="flex items-start gap-2">
            <FileText size={16} className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {summary.testsTaken}
              </p>
              <p className="text-xs text-gray-500">Tests Taken</p>
            </div>
          </div>

          {/* Passed Tests */}
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-500 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {summary.passCount}
              </p>
              <p className="text-xs text-gray-500">Passed Tests</p>
            </div>
          </div>

          {/* Failed Tests */}
          <div className="flex items-start gap-2">
            <XCircle size={16} className="text-red-500 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {summary.failCount}
              </p>
              <p className="text-xs text-gray-500">Failed Tests</p>
            </div>
          </div>

          {/* Average Score */}
          <div className="flex items-start gap-2">
            <FileText size={16} className="text-purple-500 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {summary.averageScore.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400">No test data available</p>
      )}
    </CardContainer>
  );
};

export default TestScoreCard;
