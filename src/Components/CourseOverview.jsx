// src/Components/CourseOverview.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, PlayCircle } from "lucide-react";
import { Star, Users, Clock, Target, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

/**
 * Props:
 * - course: object (name, description, thumbnail, university, chapters: [{title, description, video}])
 * - selectedChapterIndex: number
 * - onSelectChapterIndex: function(index)
 * - onEnrolled: optional function(enrollmentObj) -> called when enroll succeeded or when resuming
 *
 * Notes:
 * - Reads "studentID" from localStorage (case-sensitive).
 * - Calls backend endpoints:
 *    GET  ${API_BASE}/getEnrolledCourses?studentId=<studentID>
 *    POST ${API_BASE}/enrollCourse   { courseId, studentId }
 */
export default function CourseOverview({
  course = {},
  selectedChapterIndex = 0,
  onSelectChapterIndex = () => {},
  onEnrolled = null, // optional callback from parent page for navigation
}) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Overview");
  const [checkingEnroll, setCheckingEnroll] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledData, setEnrolledData] = useState(null);
  const [error, setError] = useState("");

  // Map API chapters to UI shape (defensive)
  const chapters = Array.isArray(course && course.chapters)
    ? course.chapters.map((c = {}, i) => ({
        number: i + 1,
        title: c.title || c.name || `Chapter ${i + 1}`,
        duration: c.duration || "",
        description: c.description || "",
        video: c.video || c.url || "",
      }))
    : [];

  const sectionRefs = useRef({});

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Check if user already enrolled in this course
  useEffect(() => {
    let cancelled = false;
    async function checkEnrollment() {
      setCheckingEnroll(true);
      setEnrolledData(null);
      setError("");
      const studentID = localStorage.getItem("studentID"); // case-sensitive primary key
      const courseId = course?._id || course?.id || course?.courseId;
      if (!studentID || !courseId) {
        setCheckingEnroll(false);
        return;
      }

      try {
        const url = `${API_BASE.replace(
          /\/$/,
          ""
        )}/getEnrolledCourses?studentId=${encodeURIComponent(studentID)}`;
        const res = await fetch(url);
        const json = await res.json().catch(() => null);
        if (!cancelled && res.ok && Array.isArray(json?.data)) {
          const match = json.data.find(
            (enr) => String(enr.courseId) === String(courseId)
          );
          if (match) {
            setEnrolledData(match);
            // cache to sessionStorage for other pages
            try {
              sessionStorage.setItem(
                `course:${courseId}`,
                JSON.stringify(match)
              );
            } catch (e) {}
          } else {
            setEnrolledData(null);
          }
        } else if (!cancelled && json && !res.ok) {
          setError(json.error || json.message || "Failed to check enrollment");
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("checkEnrollment failed", err);
        }
      } finally {
        if (!cancelled) setCheckingEnroll(false);
      }
    }

    checkEnrollment();
    return () => {
      cancelled = true;
    };
  }, [course]);

  // helper: navigate to enrolled page (prefer parent handler)
  function goToEnrolled(enrollmentObj) {
    const courseId = course?._id || course?.id || course?.courseId;
    if (typeof onEnrolled === "function") {
      try {
        onEnrolled(enrollmentObj);
        return;
      } catch (e) {
        // fallthrough to internal navigation
      }
    }
    // internal fallback navigation
    navigate(`/enrolled/${courseId}`, {
      state: {
        course: enrollmentObj || course,
        chapterIndex: enrollmentObj?.currentChapterIndex ?? 0,
      },
    });
  }

  // Enroll button handler
  async function handleEnrollClick() {
    const courseId = course?._id || course?.id || course?.courseId;
    const studentID = localStorage.getItem("studentID");
    if (!studentID) {
      alert("studentID not found in localStorage. Please login.");
      return;
    }
    if (!courseId) {
      alert("Course ID not found. Cannot enroll.");
      return;
    }

    // If already enrolled, just go to enrolled page
    if (enrolledData) {
      goToEnrolled(enrolledData);
      return;
    }

    // Otherwise, call enroll endpoint
    setEnrolling(true);
    setError("");
    try {
      const payload = {
        courseId: String(courseId),
        studentId: String(studentID),
      };
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/enrollCourse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);

      // assume server returns { ok: true, data: [ enrollmentObj, ... ] } like your example
      if (res.ok && Array.isArray(json?.data) && json.data.length > 0) {
        const enrollmentObj = json.data[0];
        setEnrolledData(enrollmentObj);
        try {
          sessionStorage.setItem(
            `course:${courseId}`,
            JSON.stringify(enrollmentObj)
          );
          localStorage.setItem(
            `enrollmentId:${courseId}`,
            enrollmentObj._id || enrollmentObj.id || ""
          );
        } catch (e) {}
        goToEnrolled(enrollmentObj);
        return;
      }

      // server may respond ok:false but still include data (already enrolled)
      if (json?.data) {
        const enrollmentObj = Array.isArray(json.data)
          ? json.data[0]
          : json.data;
        setEnrolledData(enrollmentObj);
        try {
          sessionStorage.setItem(
            `course:${courseId}`,
            JSON.stringify(enrollmentObj)
          );
        } catch (e) {}
        goToEnrolled(enrollmentObj);
        return;
      }

      const msg =
        (json && (json.error || json.message)) ||
        `Enroll failed (HTTP ${res?.status})`;
      setError(msg);
      alert(msg);
    } catch (err) {
      console.error("Enroll failed", err);
      setError(err.message || "Enroll failed");
      alert("Enroll failed. Check console for details.");
    } finally {
      setEnrolling(false);
    }
  }

  // chapter click: select chapter and if enrolled, navigate into enrolled course
  function handleChapterClick(idx) {
    onSelectChapterIndex(idx);
    if (enrolledData) {
      goToEnrolled(enrolledData);
    } else {
      // If not enrolled, do nothing else — selecting chapter will update CoursePlayer when user enrolls
    }
  }

  return (
    <div className="flex bg-gray-50 p-4 gap-4">
      <main className="flex-1 space-y-4">
        {/* Overview */}
        <section
          id="Overview"
          ref={(el) => (sectionRefs.current["Overview"] = el)}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">
                {course?.name || course?.title || "Course title"}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {course?.description || ""}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <strong className="font-semibold">
                    {course?.rating ?? "4.5/5"}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users size={16} className="text-purple-500" />
                  <strong className="font-semibold">
                    {course?.enrolled ?? "—"}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <strong className="font-semibold">
                    {course?.duration ?? "—"}
                  </strong>
                </span>
              </div>
            </div>

            <div className="w-48 flex-shrink-0">
              <button
                onClick={handleEnrollClick}
                disabled={checkingEnroll || enrolling}
                className={`w-full py-2 px-3 rounded-lg text-white font-semibold ${
                  enrolledData
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } ${
                  checkingEnroll || enrolling ? "opacity-70 cursor-wait" : ""
                }`}
              >
                {checkingEnroll
                  ? "Checking..."
                  : enrolling
                  ? "Processing..."
                  : enrolledData
                  ? "Resume Course"
                  : "Enroll Now"}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <img src="/assets/US.png" alt="US" className="w-5 h-5" />
              <span className="ml-1">Location</span>
              <span className="font-semibold ml-2">
                {course?.university ?? "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-purple-500" />
              <span className="ml-1">Instructor</span>
              <span className="font-semibold ml-2">
                {course?.instructor ?? "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={18} className="text-purple-500" />
              <span className="ml-1">ACT Range</span>
              <span className="font-semibold ml-2">
                {course?.actRange ?? "—"}
              </span>
            </div>
          </div>
        </section>

        {/* Chapters */}
        <section
          id="Chapters"
          ref={(el) => (sectionRefs.current["Chapters"] = el)}
          className="bg-white rounded-2xl shadow p-6"
        >
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-lg font-semibold">Chapters</h2>
            <button
              onClick={() => {
                // expand/collapse placeholder (no-op)
                setActiveSection((s) =>
                  s === "Chapters" ? "Overview" : "Chapters"
                );
              }}
              className="inline-flex items-center gap-2 text-sm text-gray-500"
            >
              <ChevronDown size={16} /> Toggle
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Browse course chapters and jump to lessons.
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {chapters.length === 0 ? (
              <div className="text-sm text-gray-500">No chapters available</div>
            ) : (
              chapters.map((ch, idx) => (
                <div
                  key={ch.number ?? idx}
                  onClick={() => handleChapterClick(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleChapterClick(idx);
                  }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      idx === selectedChapterIndex
                        ? "bg-purple-600 text-white"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {ch.number ?? idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {ch.title}
                      </div>
                      <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                        {ch.duration}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {ch.description}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="ml-3 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed text-sm"
                    aria-label={`Locked chapter ${ch.number ?? idx + 1}`}
                    aria-disabled="true"
                  >
                    <PlayCircle size={16} /> Locked
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
