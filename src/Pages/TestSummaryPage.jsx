import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import HeaderSection from "../Components/HeaderSection";
import StatsSection from "../Components/StatsSection";
import EventsSection from "../Components/EventsSection";
import ChartSection from "../Components/ChartSection";
import API_BASE from "../config";

function TestSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toastShown = useRef(false);
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentID");

  // 🔥 Fetch student test reports (initial load)
  useEffect(() => {
    const fetchReports = async () => {
      if (!studentId) {
        setLoading(false);
        toast.error("⚠️ No student ID found. Please log in again.");
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/testReports/by-student/${studentId}`
        );
        const data = await res.json();

        if (res.ok && data.ok) {
          setSummary(data.data.summary);
          setReports(data.data.reports);
        } else {
          toast.error(data.error || "Failed to load test summary");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        toast.error("Something went wrong fetching reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [studentId]);

  // ✅ Merge new report passed from TestDetailPage
  useEffect(() => {
    const newReport = location.state?.report;
    if (newReport) {
      setReports((prev) => {
        const exists = prev.some((r) => r._id === newReport._id);
        if (exists) return prev;
        return [newReport, ...prev];
      });

      setSummary((prev) => {
        const prevTaken = prev?.testsTaken || 0;
        const prevPassed = prev?.passCount || 0;
        const prevFailed = prev?.failCount || 0;

        return {
          ...(prev || {}),
          testsTaken: prevTaken + 1,
          passCount: prevPassed + (newReport.passed ? 1 : 0),
          failCount: prevFailed + (newReport.passed ? 0 : 1),
          averageScore: prev?.averageScore
            ? (prev.averageScore * prevTaken + newReport.percentage) /
              (prevTaken + 1)
            : newReport.percentage,
        };
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location.state?.report, navigate, location.pathname]);

  // ✅ Toasts after submission
  useEffect(() => {
    if (location.state?.submitted && !toastShown.current) {
      toastShown.current = true;

      if (location.state?.auto) {
        toast.success("⏰ Time’s up! Test auto-submitted.");
      } else {
        toast.success("✅ Test submitted successfully!");
      }

      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div>
      {/* ✅ Pass averageScore into HeaderSection */}
      <HeaderSection averageScore={summary?.averageScore} />

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading summary...</p>
      ) : (
        <>
          {/* 📊 Summary Stats */}
          <StatsSection summary={summary} totalTests={reports?.length} />

          {/* 📝 Reports Table/List */}
          <EventsSection reports={reports} />

          {/* 📈 Charts */}
          <ChartSection summary={summary} reports={reports} />
        </>
      )}
    </div>
  );
}

export default TestSummaryPage;
