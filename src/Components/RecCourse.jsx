import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config"; // default import

export default function RecommendedCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/getCourses`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        let raw = json && json.data ? json.data : [];
        if (!Array.isArray(raw)) raw = [raw];

        const mapped = raw.map((c, idx) => {
          const id = c._id || c.id || `course-${idx}`;
          return {
            id,
            title: c.name || c.title || "Untitled Course",
            image: c.thumbnail || c.image || "/assets/rec-placeholder.png",
            provider: c.university || c.provider || "Unknown Provider",
            chapters: Array.isArray(c.chapters) ? c.chapters : [],
            raw: c,
          };
        });

        const deduped = mapped.reduce((acc, cur) => {
          if (!acc.find((x) => x.id === cur.id)) acc.push(cur);
          return acc;
        }, []);

        if (mounted) setCourses(deduped);
      } catch (err) {
        console.error("Failed to load recommended courses:", err);
        if (mounted) setError(err.message || "Failed to load courses");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClick = (course) => {
    setSelectedCourse(course.id);
    sessionStorage.setItem(`course:${course.id}`, JSON.stringify(course));
    navigate(`/course/${course.id}`, { state: { course } });
  };

  // 🔹 Skeleton loader (3 by default)
  const renderSkeletons = (count = 3) => {
    return Array.from({ length: count }).map((_, idx) => (
      <div
        key={`rec-skeleton-${idx}`}
        className="bg-white rounded-xl shadow p-4 animate-pulse"
        aria-hidden="true"
      >
        {/* image placeholder */}
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4" />

        {/* title placeholder */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

        {/* provider placeholder */}
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    ));
  };

  return (
    <div className="p-6">
      <h2 className="font-semibold mb-4">Courses</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeletons()} {/* default 3 */}
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No recommended courses</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleClick(course)}
              className={`bg-white rounded-xl shadow p-4 cursor-pointer transition hover:shadow-lg ${
                selectedCourse === course.id
                  ? "border-2 border-purple-500"
                  : "border border-transparent"
              }`}
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-sm font-medium mb-2">{course.title}</h3>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                <Circle
                  size={8}
                  fill="currentColor"
                  className="text-purple-500"
                />
                {course.provider}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
