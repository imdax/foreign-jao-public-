import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

/**
 * CoursePlayer:
 * - Reads studentID from localStorage (case-sensitive key "studentID")
 * - On enroll click posts { courseId, studentId } where studentId is the value from localStorage
 * - Detects existing enrollment by calling getEnrolledCourses
 * - Calls onEnrolled(enrollmentObj) when enrollment succeeded or user clicks Resume
 *
 * Props:
 * - course
 * - selectedChapterIndex
 * - onSelectChapterIndex
 * - backPath
 * - onEnrolled(enrollmentObj)  <-- required for redirect after enroll/resume
 */
export default function CoursePlayer({
  course,
  selectedChapterIndex = 0,
  onSelectChapterIndex = () => {},
  backPath = "/courses",
  onEnrolled = () => {},
}) {
  const navigate = useNavigate();
  const courseId = course?._id || course?.id || course?.courseId;

  const [enrolling, setEnrolling] = useState(false);
  const [enrolledData, setEnrolledData] = useState(null); // full enrollment object if present
  const [enrollError, setEnrollError] = useState("");

  // On mount — check backend for existing enrollment for current student & course
  useEffect(() => {
    let cancelled = false;
    const studentID = localStorage.getItem("studentID");
    if (!studentID || !courseId) {
      setEnrolledData(null);
      return;
    }

    async function checkEnrollment() {
      try {
        const url = `${API_BASE.replace(
          /\/$/,
          ""
        )}/getEnrolledCourses?studentId=${encodeURIComponent(studentID)}`;
        const res = await fetch(url);
        const json = await res.json().catch(() => null);

        if (!cancelled && res.ok && Array.isArray(json?.data)) {
          // server returns array; find matching courseId
          const match = json.data.find(
            (enr) => String(enr.courseId) === String(courseId)
          );
          if (match) setEnrolledData(match);
          else setEnrolledData(null);
        }
      } catch (err) {
        console.debug("checkEnrollment failed", err);
      }
    }

    checkEnrollment();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  function handleBack() {
    navigate(backPath, { replace: true });
  }

  async function handleEnroll() {
    // If already enrolled -> call parent handler to redirect to enrolled page
    if (enrolledData) {
      onEnrolled(enrolledData);
      return;
    }

    // Enroll now
    const studentIDValue = localStorage.getItem("studentID");
    if (!studentIDValue) {
      alert("studentID not found in localStorage. Please login.");
      return;
    }
    if (!courseId) {
      alert("No courseId available. Cannot enroll.");
      return;
    }

    const payload = { courseId, studentId: studentIDValue };

    setEnrolling(true);
    setEnrollError("");
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/enrollCourse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      // Server shape: json.ok true and json.data is an array (per your example)
      if (res.ok && Array.isArray(json?.data) && json.data.length > 0) {
        const enrollmentObj = json.data[0];
        // store enrollment locally for resume / caching
        try {
          sessionStorage.setItem(
            `course:${courseId}`,
            JSON.stringify(enrollmentObj)
          );
          sessionStorage.setItem(
            `enrollmentId:${courseId}`,
            enrollmentObj._id || enrollmentObj.id || ""
          );
          localStorage.setItem(
            `enrollmentId:${courseId}`,
            enrollmentObj._id || enrollmentObj.id || ""
          );
          // keep studentID in storage as canonical key
          localStorage.setItem("studentID", studentIDValue);
        } catch (e) {
          console.warn("storage write failed", e);
        }

        setEnrolledData(enrollmentObj);
        // delegate navigation to parent page
        onEnrolled(enrollmentObj);
        return;
      }

      // If server returned ok:false but included data (already enrolled)
      if (json?.data) {
        const enrollmentObj2 = Array.isArray(json.data)
          ? json.data[0]
          : json.data;
        setEnrolledData(enrollmentObj2);
        try {
          sessionStorage.setItem(
            `course:${courseId}`,
            JSON.stringify(enrollmentObj2)
          );
        } catch (e) {}
        onEnrolled(enrollmentObj2);
        return;
      }

      const msg =
        (json && (json.error || json.message)) ||
        `Enroll failed (HTTP ${res.status})`;
      setEnrollError(msg);
      alert(msg);
    } catch (err) {
      console.error("Enroll request failed:", err);
      setEnrollError(err.message || "Enroll failed");
      alert(`Enroll failed: ${err.message || err}`);
    } finally {
      setEnrolling(false);
    }
  }

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            aria-label="Go back to courses"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div>
            <h1 className="text-xl font-semibold">
              {course?.name || course?.title || "Course"}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <img src="/assets/US.png" alt="flag" className="w-5 h-5" />
              By {course?.university || course?.provider || "Unknown"}
            </p>
          </div>
        </div>

        <button
          onClick={handleEnroll}
          disabled={enrolling}
          aria-busy={enrolling}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            enrolledData
              ? "bg-green-600 text-white"
              : "bg-purple-500 text-white"
          } ${enrolling ? "opacity-70 cursor-wait" : ""}`}
        >
          {enrolling
            ? "Processing..."
            : enrolledData
            ? "Resume Course"
            : "Enroll Now"}
        </button>
      </div>

      {/* Thumbnail / Player placeholder */}
      <div className="bg-black rounded-lg overflow-hidden">
        <img
          src={
            course?.thumbnail ||
            course?.courseThumbnail ||
            "/assets/ml-course-thumbnail.png"
          }
          alt={`${course?.name || course?.title || "Course"} thumbnail`}
          className="w-full h-fit object-cover"
          onError={(e) => {
            e.currentTarget.src = "/assets/ml-course-thumbnail.png";
          }}
        />
      </div>

      {enrollError ? (
        <div className="mt-3 text-sm text-red-500">{enrollError}</div>
      ) : null}
    </div>
  );
}
