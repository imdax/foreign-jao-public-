import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Clock } from "lucide-react";
import API_BASE from "../config";
const TestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeGiven, setTimeGiven] = useState(null);

  const studentID = localStorage.getItem("studentID"); // ✅ must be MongoDB ObjectId from login

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`${API_BASE}/tests/${id}`);
        if (!res.ok) throw new Error("Failed to fetch test");
        const data = await res.json();
        const testData = data.data || data;
        setTest(testData);

        if (testData.time) {
          setTimeLeft(testData.time * 60);
          setTimeGiven(testData.time * 60);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // Countdown
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Prevent leaving test
  useEffect(() => {
    const beforeUnloadHandler = (e) => {
      e.preventDefault();
      e.returnValue = "You cannot leave during the test!";
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("🚫 You cannot go back during the test!");
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSelect = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const buildReport = () => {
    if (!test) return null;

    let totalMarks = 0;
    let scored = 0;

    const answersArray = test.assignment.map((q) => {
      const selected = answers[q._id] || null;
      const isCorrect = selected === q.correctAnswer;

      const marksForQuestion = q.marks || 1;
      totalMarks += marksForQuestion;
      if (isCorrect) scored += marksForQuestion;

      return {
        question: q.question,
        optionSelected: selected,
        correct: isCorrect,
      };
    });

    const totalTimeTaken = timeGiven ? (timeGiven - timeLeft) / 60 : null;

    return {
      testID: test._id, // ✅ valid ObjectId string
      studentID, // ✅ must be ObjectId string
      totalMarks,
      totalMarksScored: scored,
      totalTimeGiven: timeGiven / 60, // minutes
      totalTimeTaken: totalTimeTaken ? Math.round(totalTimeTaken) : null,
      answers: answersArray,
    };
  };

  const submitReport = async (report) => {
    try {
      console.log("📦 Report being sent:", report);
      const res = await fetch(`${API_BASE}/testReports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("❌ Server rejected:", data);
        throw new Error(data.message || `Server error ${res.status}`);
      }

      console.log("✅ Report submitted:", data);
    } catch (err) {
      console.error("Error submitting report:", err);
    } finally {
      navigate("/tests", { state: { submitted: true } });
    }
  };

  const handleSubmit = () => {
    const report = buildReport();
    if (report) submitReport(report);
  };

  const handleAutoSubmit = () => {
    const report = buildReport();
    if (report) submitReport(report);
  };

  if (loading) return <p className="p-6">Loading test...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!test) return <p className="p-6">No test found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-500" size={28} />
            <h1 className="text-2xl font-bold">{test.name}</h1>
          </div>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-purple-600 font-semibold text-lg">
              <Clock size={18} /> {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <p className="text-gray-600">{test.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <Clock size={16} /> Duration: {test.time} mins
        </div>

        {/* Questions */}
        <div className="mt-8 space-y-6">
          {test.assignment?.map((q, idx) => (
            <div
              key={q._id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <p className="font-medium text-gray-800 mb-3">
                {idx + 1}. {q.question}
                {q.marks && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({q.marks} marks)
                  </span>
                )}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition ${
                      answers[q._id] === opt
                        ? "bg-purple-100 border-purple-500"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={() => handleSelect(q._id, opt)}
                      className="accent-purple-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetailPage;
