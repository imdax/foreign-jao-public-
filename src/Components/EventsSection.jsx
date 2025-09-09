import React, { useEffect, useState } from "react";
import { FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";
const EventsSection = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`${API_BASE}/tests`);
        if (!res.ok) throw new Error("Failed to fetch tests");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setTests(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold">New events are live.</h2>

      {/* 🔄 Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-lg shadow animate-pulse"
            >
              <div className="h-6 w-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* ❌ Error */}
      {error && (
        <p className="text-red-500 mt-4">Failed to load tests: {error}</p>
      )}

      {/* ✅ Tests List */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {tests.length > 0 ? (
            tests.map((test, idx) => (
              <div
                key={test._id || idx}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <FileText className="text-purple-500 mb-2" size={28} />
                <h3 className="font-semibold text-lg">{test.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-3">
                  {test.description || "No description available."}
                </p>
                {/* 🕒 Duration */}
                {test.time && (
                  <p className="text-xs text-gray-400 mt-2">
                    ⏳ Duration: {test.time} mins
                  </p>
                )}
                {/* 📅 Date (if available) */}
                {test.date && (
                  <p className="text-xs text-gray-400">
                    📅 {new Date(test.date).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={() => navigate(`/tests/${test._id}`)}
                  className="mt-4 text-purple-600 flex items-center gap-1 font-medium"
                >
                  Start Test <ArrowRight size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-6">
              <FileText className="mx-auto text-gray-300" size={40} />
              <p className="mt-2">No new tests available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsSection;
