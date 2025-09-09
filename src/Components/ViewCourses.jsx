// src/Pages/ViewCourses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchCourses() {
      setLoading(true);
      setError("");

      try {
        const studentId = localStorage.getItem("studentID");

        if (!studentId) {
          throw new Error(
            "studentId missing in localStorage. Please set localStorage.setItem('studentId', '<id>')"
          );
        }

        const url = `${API_BASE.replace(
          /\/$/,
          ""
        )}/getEnrolledCourses?studentId=${encodeURIComponent(studentId)}`;
        console.debug("[ViewCourses] fetching enrolled courses:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        console.debug("[ViewCourses] API response:", json);

        let raw = [];
        if (Array.isArray(json)) raw = json;
        else if (Array.isArray(json.data)) raw = json.data;
        else if (json.data && Array.isArray(json.data.courses))
          raw = json.data.courses;
        else if (json.enrollments && Array.isArray(json.enrollments))
          raw = json.enrollments;
        else if (
          json.data &&
          !Array.isArray(json.data) &&
          typeof json.data === "object"
        )
          raw = [json.data];
        else if (json && typeof json === "object" && Object.keys(json).length)
          raw = json.data || [];

        if (!Array.isArray(raw)) raw = [];

        const mapped = raw.map((e = {}, idx) => {
          const total =
            Number(e.totalChapters) ||
            (Array.isArray(e.chapters) ? e.chapters.length : 0);
          const completed = Number(e.completedChapters) || 0;
          const progress =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          return {
            id: e._id || e.enrollmentId || e.courseId || `enroll-${idx}`,
            courseId: e.courseId || e._id || e.id,
            title:
              e.courseName ||
              e.name ||
              e.title ||
              e.courseDescription ||
              "Untitled Course",
            description: e.courseDescription || e.description || "",
            image:
              (e.courseThumbnail && e.courseThumbnail !== "") ||
              (e.thumbnail && e.thumbnail !== "")
                ? e.courseThumbnail || e.thumbnail
                : "/assets/course-placeholder.png",
            chapters: Array.isArray(e.chapters) ? e.chapters : [],
            totalChapters: total,
            completedChapters: completed,
            currentChapterIndex:
              typeof e.currentChapterIndex === "number"
                ? e.currentChapterIndex
                : 0,
            progress,
            raw: e,
          };
        });

        if (mounted) setCourses(mapped);
      } catch (err) {
        console.error("Failed to load enrolled courses:", err);
        if (mounted) {
          setError(err.message || "Failed to load courses");
          setCourses([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  function openCourse(course) {
    try {
      const storageKey = `course:${course.courseId ?? course.id}`;
      sessionStorage.setItem(storageKey, JSON.stringify(course.raw || course));
    } catch (e) {
      console.warn("Failed to persist course to sessionStorage", e);
    }

    // navigate to enrolled page
    navigate(`/enrolled/${course.courseId ?? course.id}`, {
      state: {
        course: course.raw || course,
        chapterIndex: course.currentChapterIndex ?? 0,
      },
    });
  }

  // Skeleton generator: returns an array of n skeletons to display while loading
  const renderSkeletons = (count = 3) => {
    return Array.from({ length: count }).map((_, idx) => (
      <div
        key={`skeleton-${idx}`}
        className="bg-white rounded-xl shadow p-4 animate-pulse"
        aria-hidden="true"
      >
        {/* image placeholder */}
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4" />

        {/* title placeholder */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

        {/* progress bar placeholder */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-gray-200 h-2 rounded-full"
            style={{ width: "40%" }}
          />
        </div>

        {/* meta placeholders */}
        <div className="flex justify-between items-center mt-2">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            View Courses
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Keep track and complete all of your enrolled courses
          </p>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Recently Accessed</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Categories</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Progress</option>
        </select>
      </div>

      <h2 className="font-semibold mb-4">Enrolled Courses</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {renderSkeletons(3)}
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => openCourse(course)}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = "/assets/course-placeholder.png";
                }}
              />
              <h3 className="text-sm font-medium mb-2 text-gray-800">
                {course.title}
              </h3>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${Math.max(0, Math.min(100, course.progress))}%`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-gray-500">
                <p className="text-xs">{course.progress}%</p>
                <p className="text-xs">
                  {course.completedChapters}/{course.totalChapters} chapters
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
