import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API_BASE from "../config";
import CoursePlayer from "../Components/CoursePlayer";
import CourseOverview from "../Components/CourseOverview";

export default function CourseDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const navChapterIndex =
    typeof location?.state?.chapterIndex === "number"
      ? location.state.chapterIndex
      : 0;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChapterIndex, setSelectedChapterIndex] =
    useState(navChapterIndex);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function safeJsonParse(res) {
      try {
        return await res.json();
      } catch {
        return null;
      }
    }

    async function load() {
      try {
        const res = await fetch(
          `${API_BASE.replace(/\/$/, "")}/getSpecificCourseData/${id}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch course");
        const json = await safeJsonParse(res);
        const data = json?.data || json;
        if (mounted) setCourse(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!course) return <div className="p-6">No course found</div>;

  // centralised navigation: called by CoursePlayer after enroll or resume
  function handleEnrolledRedirect(enrollmentObj) {
    // Ensure we navigate to /enrolled/:courseId and pass the latest enrollment/course in state
    const targetCourseId = course?._id || course?.id || id;
    navigate(`/enrolled/${targetCourseId}`, {
      state: {
        // prefer enrollmentObj (server-provided), otherwise the canonical course object
        course: enrollmentObj || course,
        chapterIndex:
          enrollmentObj?.currentChapterIndex ?? selectedChapterIndex ?? 0,
      },
    });
  }

  return (
    <div>
      <CoursePlayer
        course={course}
        selectedChapterIndex={selectedChapterIndex}
        onSelectChapterIndex={setSelectedChapterIndex}
        // pass handler used by CoursePlayer to navigate after enroll/resume
        onEnrolled={handleEnrolledRedirect}
      />
      <CourseOverview
        course={course}
        selectedChapterIndex={selectedChapterIndex}
        onSelectChapterIndex={setSelectedChapterIndex}
      />
    </div>
  );
}
