// src/Pages/EnrolledCourse.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Info, BookOpen, CheckCircle } from "lucide-react";
import API_BASE from "../config";

function parseVideoUrl(url) {
  if (!url) return null;
  url = url.trim();

  const yt = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (yt)
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt[1]}`,
    };

  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) {
    return { kind: "file", src: url };
  }

  return null;
}

export default function EnrolledCourse() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeSidebar, setActiveSidebar] = useState("overview");
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingChapterIdx, setUpdatingChapterIdx] = useState(null); // index being updated

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      setActiveSidebar("overview");

      const studentID = localStorage.getItem("studentID"); // case-sensitive
      if (studentID && courseId) {
        try {
          const res = await fetch(
            `${API_BASE.replace(
              /\/$/,
              ""
            )}/getEnrolledCourses?studentId=${studentID}`
          );
          const json = await res.json();

          if (res.ok && Array.isArray(json?.data)) {
            const match = json.data.find(
              (enr) => String(enr.courseId) === String(courseId)
            );
            if (match) {
              // normalize chapters to ensure completed flags exist
              const normalized = {
                ...match,
                chapters: Array.isArray(match.chapters)
                  ? match.chapters.map((c) => ({
                      ...c,
                      completed:
                        typeof c.completed === "boolean" ? c.completed : false,
                    }))
                  : [],
              };
              setCourse(normalized);

              // seed local completed map from enrollment chapters
              const compMap = {};
              (normalized.chapters || []).forEach((c, idx) => {
                if (c.completed) compMap[idx] = true;
              });
              setCompleted(compMap);

              sessionStorage.setItem(
                `course:${courseId}`,
                JSON.stringify(normalized)
              );
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn("Failed to fetch enrolled courses", err);
        }
      }

      // fallback: use location.state or sessionStorage
      if (location.state?.course) {
        const fallback = location.state.course;
        setCourse(fallback);
        sessionStorage.setItem(`course:${courseId}`, JSON.stringify(fallback));
        // seed completed from fallback chapters if present
        const compMap = {};
        (fallback.chapters || []).forEach((c, idx) => {
          if (c.completed) compMap[idx] = true;
        });
        setCompleted(compMap);
      } else {
        const raw = sessionStorage.getItem(`course:${courseId}`);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setCourse(parsed);
            const compMap = {};
            (parsed.chapters || []).forEach((c, idx) => {
              if (c.completed) compMap[idx] = true;
            });
            setCompleted(compMap);
          } catch (e) {
            console.warn("Failed to parse cached course", e);
          }
        }
      }

      setLoading(false);
    }

    loadCourse();
  }, [courseId, location.state]);

  function startCourse() {
    setActiveSidebar("chapter-0");
  }

  async function handleCompleteChapter(idx) {
    if (!course) return;
    // Prevent double-click while updating
    if (updatingChapterIdx !== null) return;

    // optimistic update
    const prevCompleted = { ...completed };
    const newCompleted = { ...completed, [idx]: true };
    setCompleted(newCompleted);

    // build chapters payload marking the idx as completed
    const updatedChapters = (course.chapters || []).map((c, i) => ({
      ...c,
      completed: i === idx ? true : !!c.completed,
    }));

    const completedCount = Object.keys(newCompleted).length;

    // determine enrollment id (backend enrollment object _id)
    const enrollmentId = course?._id || course?.id || null;
    const studentID = localStorage.getItem("studentID");

    if (!enrollmentId || !studentID) {
      // cannot sync — persist locally and exit
      console.warn("Missing enrollmentId or studentID; persisting local only.");
      // update session storage so resume picks this up
      try {
        const patched = {
          ...course,
          chapters: updatedChapters,
          completedChapters: completedCount,
        };
        setCourse(patched);
        sessionStorage.setItem(`course:${courseId}`, JSON.stringify(patched));
      } catch (e) {}
      return;
    }

    setUpdatingChapterIdx(idx);

    try {
      const payload = {
        enrollmentId,
        courseId: String(courseId),
        studentId: studentID,
        completedChapters: completedCount,
        chapters: updatedChapters,
      };

      const res = await fetch(
        `${API_BASE.replace(
          /\/$/,
          ""
        )}/getEnrolledCourses?studentId=${studentID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok !== false) {
        // If backend returned updated enrollment object in json.data (or json.data[0]), prefer it
        const returned =
          (json.data &&
            (Array.isArray(json.data) ? json.data[0] : json.data)) ||
          null;

        const newCourseState = returned
          ? {
              ...returned,
              chapters: Array.isArray(returned.chapters)
                ? returned.chapters.map((c) => ({
                    ...c,
                    completed:
                      typeof c.completed === "boolean" ? c.completed : false,
                  }))
                : updatedChapters,
            }
          : {
              ...course,
              chapters: updatedChapters,
              completedChapters: completedCount,
            };

        setCourse(newCourseState);
        // persist updated enrollment to sessionStorage
        try {
          sessionStorage.setItem(
            `course:${courseId}`,
            JSON.stringify(newCourseState)
          );
        } catch (e) {
          console.warn("Failed to persist updated enrollment", e);
        }
      } else {
        // server rejected — rollback optimistic change
        setCompleted(prevCompleted);
        const errMsg =
          (json && (json.error || json.message)) || "Failed to update progress";
        alert(errMsg);
      }
    } catch (err) {
      // network error — rollback
      setCompleted(prevCompleted);
      console.error("Failed to update enrollment:", err);
      alert("Failed to update progress. Please check your connection.");
    } finally {
      setUpdatingChapterIdx(null);
    }
  }

  function handleNextChapter(idx) {
    if (course?.chapters && idx + 1 < course.chapters.length) {
      setActiveSidebar(`chapter-${idx + 1}`);
    }
  }

  function closeCourse() {
    navigate("/courses"); // ✅ navigate to Courses.jsx
  }

  const totalChapters = course?.chapters?.length || 0;
  const completedChapters = Object.keys(completed).length;
  const progress = totalChapters
    ? Math.round((completedChapters / totalChapters) * 100)
    : 0;

  const imageSrc =
    course?.courseThumbnail ||
    course?.image ||
    course?.thumbnail ||
    "/assets/course-placeholder.png";

  if (loading) {
    return <div className="p-6">Loading enrolled course...</div>;
  }

  if (!course) {
    return (
      <div className="p-6 text-red-500">
        Course not found in your enrolled list.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-[5px] flex-1 w-full">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm p-0 mx-[5px] mb-[5px]">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 text-center">
              {course?.title || course?.courseName || "Course Title"}
            </h2>
            <div className="mt-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-purple-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{progress}%</span>
                <span>
                  {completedChapters}/{totalChapters} chapters
                </span>
              </div>
            </div>
          </div>

          <nav className="mt-2">
            {/* Overview */}
            <button
              onClick={() => setActiveSidebar("overview")}
              className={`w-full flex items-center px-4 py-4 border-t border-b border-gray-200 ${
                activeSidebar === "overview"
                  ? "bg-purple-50 text-purple-700 font-semibold"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Info className="h-5 w-5" />
              <span className="ml-3 text-base">Overview</span>
            </button>

            {/* Chapters */}
            {course?.chapters?.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSidebar(`chapter-${idx}`)}
                className={`w-full flex items-center px-4 py-4 border-t border-b border-gray-200 ${
                  activeSidebar === `chapter-${idx}`
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {completed[idx] ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
                <span className="ml-3 text-base">{ch.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-md p-6 mx-[5px] mb-[5px]">
          {activeSidebar === "overview" ? (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                {course?.title || course?.courseName || "Course Title"}
              </h3>
              {/* <p className="text-sm text-gray-500 mt-1">
                {course?.courseDescription ||
                  "This overview provides information about the course."}
              </p> */}

              <div className="mt-6">
                <img
                  src={imageSrc}
                  alt={course?.title || "Course preview"}
                  className="w-full h-fit object-cover rounded-xl shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/course-placeholder.png";
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium text-gray-800">
                    {course?.instructor || course?.teacher || "Unknown"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800">
                    {course?.duration || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="font-medium text-gray-800">{progress}%</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3 border-b-2 border-gray-300">
                  Description
                </h4>
                <p className="text-sm text-gray-600">
                  {course?.longDescription ||
                    course?.courseDescription ||
                    "This overview provides the core information about the course. Click Start the course to begin."}
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={startCourse}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-base font-medium"
                >
                  Start the course
                </button>
              </div>
            </div>
          ) : (
            course?.chapters?.map((ch, idx) =>
              activeSidebar === `chapter-${idx}` ? (
                <div key={idx}>
                  <h4 className="text-xl font-semibold mb-2">{ch.title}</h4>

                  {/* Video */}
                  {(() => {
                    const parsed = parseVideoUrl(ch.video);
                    if (!parsed) return null;
                    if (parsed.kind === "youtube") {
                      return (
                        <div
                          style={{ position: "relative", paddingTop: "56.25%" }}
                          className="mb-4"
                        >
                          <iframe
                            title={`video-${idx}`}
                            src={parsed.embedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                          />
                        </div>
                      );
                    }
                    if (parsed.kind === "file") {
                      return (
                        <video
                          controls
                          src={parsed.src}
                          className="w-full rounded-lg mb-4"
                          style={{ maxHeight: "60vh" }}
                        />
                      );
                    }
                    return null;
                  })()}

                  {/* Description below video */}
                  <h2 className="border-b-2 border-gray-300">Description</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {ch.description ||
                      "No description available for this chapter."}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleCompleteChapter(idx)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                      disabled={completed[idx] || updatingChapterIdx === idx}
                    >
                      {completed[idx]
                        ? "Completed"
                        : updatingChapterIdx === idx
                        ? "Saving..."
                        : "Complete Chapter"}
                    </button>
                    {idx + 1 < course.chapters.length && (
                      <button
                        onClick={() => handleNextChapter(idx)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                      >
                        Next Chapter
                      </button>
                    )}
                  </div>
                </div>
              ) : null
            )
          )}
        </main>
      </div>

      {/* ✅ Close Course Player button */}
      <div className="max-w-[1200px] mx-auto w-full mt-4">
        <button
          onClick={closeCourse}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg text-base font-medium"
        >
          Close Course Player
        </button>
      </div>
    </div>
  );
}
