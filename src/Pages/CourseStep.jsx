// src/Components/CourseSteps.jsx
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

/**
 * CourseSteps
 *
 * Props:
 * - course: {
 *     _id, name/title, description, thumbnail, university,
 *     chapters: [{ title, description, completed (bool) }],
 *     groups: [{ title, summary, chapters: [indices] }]  // optional grouping
 *   }
 * - initialGroupOpen: string|null  // optional group id/title to open
 * - onOpenStep(index)              // callback when Open Step clicked
 *
 * This component is intentionally self-contained and uses Tailwind classes
 * consistent with your existing project style (rounded cards, subtle shadows).
 */

export default function CourseSteps({
  course = {},
  initialGroupOpen = "Overview",
  onOpenStep = () => {},
}) {
  // Defensive shapes
  const title = course?.name || course?.title || "Untitled Course";
  const description = course?.description || "";
  const thumbnail =
    course?.thumbnail ||
    course?.courseThumbnail ||
    (course?.raw && (course.raw.thumbnail || course.raw.courseThumbnail)) ||
    "/assets/course-placeholder.png";

  const chapters = Array.isArray(course?.chapters)
    ? course.chapters.map((c = {}, i) => ({
        index: i,
        title: c.title || c.name || `Step ${i + 1}`,
        description: c.description || "",
        completed: !!c.completed,
      }))
    : [];

  // If server provided groups (sections), use them; otherwise produce 1 group "All Steps"
  const groups =
    Array.isArray(course?.groups) && course.groups.length
      ? course.groups.map((g) => ({
          id: g.title,
          title: g.title,
          summary: g.summary || `${(g.chapters || []).length} steps`,
          chapters: Array.isArray(g.chapters) ? g.chapters : [],
        }))
      : [
          {
            id: "All",
            title: "All Steps",
            summary: `${chapters.length} steps`,
            chapters: chapters.map((c) => c.index),
          },
        ];

  const progress =
    typeof course?.completedChapters === "number" && course.totalChapters
      ? Math.round((course.completedChapters / course.totalChapters) * 100)
      : chapters.length === 0
      ? 0
      : Math.round(
          (chapters.filter((c) => c.completed).length / chapters.length) * 100
        );

  const [activeGroup, setActiveGroup] = useState(
    initialGroupOpen || groups[0]?.id
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  function openStep(idx) {
    setSelectedIndex(idx);
    onOpenStep(idx);
  }

  return (
    <div className="w-full h-full min-h-[640px] border rounded-lg overflow-hidden flex bg-white">
      {/* Left Sidebar */}
      <aside className="w-[360px] min-w-[320px] border-r bg-white flex flex-col">
        {/* Header + progress */}
        <div className="p-4 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <div className="text-xs text-gray-500 mt-1">
                By {course?.university || course?.provider || "Unknown"}
              </div>
            </div>
            <button
              className="text-gray-600 hover:bg-gray-100 p-1 rounded"
              aria-label="collapse sidebar"
              onClick={() => {}}
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <div className="text-xs">Progress</div>
              <div>{progress}%</div>
            </div>
          </div>
        </div>

        {/* Sections / Groups */}
        <nav className="flex-1 overflow-auto">
          <div className="divide-y">
            {/* Overview quick card */}
            <div
              className={`flex items-center gap-3 px-4 py-4 ${
                activeGroup === "Overview" ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="text-gray-600 text-sm rounded-full w-8 h-8 flex items-center justify-center border">
                i
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-800">
                  Overview
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {description.slice(0, 100)}
                </div>
              </div>
              <button
                className="text-gray-400"
                onClick={() => setActiveGroup("Overview")}
                aria-label="Show overview"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Groups list */}
            {groups.map((g) => (
              <div key={g.id} className="px-0">
                <div
                  onClick={() => setActiveGroup(g.id)}
                  className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{g.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {g.summary}
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* If this group is active, list its chapters */}
                {activeGroup === g.id && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      {(g.chapters || []).length === 0 ? (
                        <div className="text-xs text-gray-500">No steps</div>
                      ) : (
                        (g.chapters || []).map((chapIndex) => {
                          const ch = chapters[chapIndex];
                          if (!ch) return null;
                          return (
                            <div
                              key={chapIndex}
                              className={`flex items-center gap-3 p-2 rounded-md ${
                                selectedIndex === chapIndex
                                  ? "bg-gray-100"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
                                  ch.completed
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-50 text-gray-700"
                                }`}
                              >
                                {ch.index + 1}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-800 truncate">
                                  {ch.title}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {ch.description}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => openStep(ch.index)}
                                className="ml-3 px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                                aria-label={`Open step ${ch.index + 1}`}
                              >
                                Open
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t text-xs text-gray-500">
          {/* summary footer */}
          <div className="flex items-center justify-between">
            <div>{chapters.filter((c) => c.completed).length} completed</div>
            <div>{chapters.length} total</div>
          </div>
        </div>
      </aside>

      {/* Right content area */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[920px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-700">{chapters.length} Steps</div>
            <button
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              aria-label="Open in full"
            >
              <ExternalLink size={18} />
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow-sm">
            <img
              src={thumbnail}
              alt={`${title} thumbnail`}
              className="w-full h-[420px] object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "/assets/course-placeholder.png";
              }}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">About</h3>
            <p className="text-sm text-gray-600">
              {description || "No description provided."}
            </p>
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // prev
                    const prev = Math.max(0, selectedIndex - 1);
                    setSelectedIndex(prev);
                    onOpenStep(prev);
                  }}
                  className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => {
                    // next
                    const next = Math.min(
                      chapters.length - 1,
                      selectedIndex + 1
                    );
                    setSelectedIndex(next);
                    onOpenStep(next);
                  }}
                  className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="ml-4 text-sm text-gray-700">
                  Step {selectedIndex + 1} of {chapters.length || 1}
                </div>
              </div>

              <div>
                <button
                  onClick={() => onOpenStep(selectedIndex)}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Open Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
