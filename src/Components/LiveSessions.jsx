import React, { useEffect, useMemo, useState } from "react";
import { Video, Search, Play, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function LiveSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState(""); // show all initially but sorted
  const [query, setQuery] = useState("");
  const [studentNameFromProfile, setStudentNameFromProfile] = useState(null);

  function computeStatus(dateStr, startTimeStr, endTimeStr) {
    try {
      const sessionDate = new Date(dateStr);
      const [sh, sm] = (startTimeStr || "").split(":").map(Number);
      const [eh, em] = (endTimeStr || "").split(":").map(Number);

      const start = new Date(sessionDate);
      if (!Number.isNaN(sh)) start.setHours(sh, sm || 0, 0, 0);
      const end = new Date(sessionDate);
      if (!Number.isNaN(eh)) end.setHours(eh, em || 0, 0, 0);

      const now = new Date();
      const isToday =
        now.getFullYear() === sessionDate.getFullYear() &&
        now.getMonth() === sessionDate.getMonth() &&
        now.getDate() === sessionDate.getDate();

      if (isToday && start <= now && now <= end) return "ongoing";
      if (end < now) return "past";
      return "current";
    } catch {
      return "current";
    }
  }

  const statusWeight = (s) => {
    if (s === "current") return 0;
    if (s === "ongoing") return 1;
    return 2;
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const studentId = localStorage.getItem("studentID");
        if (!studentId) throw new Error('No "studentID" found in localStorage');

        const sessionsUrl = `${API_BASE}/sessions?studentId=${encodeURIComponent(
          studentId
        )}`;
        const res = await fetch(sessionsUrl);
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const payload = await res.json();
        const rawList = Array.isArray(payload) ? payload : payload?.data ?? [];

        let profileName = null;
        try {
          const profileUrl = `${API_BASE}/fetchStudentData?id=${encodeURIComponent(
            studentId
          )}`;
          const profileRes = await fetch(profileUrl);
          if (profileRes.ok) {
            const p = await profileRes.json();
            profileName = p?.data?.name || p?.name || null;
          }
        } catch {
          // ignore profile fetch errors
        }
        if (mounted) setStudentNameFromProfile(profileName);

        const mapped = rawList.map((r) => {
          const dateStr = r.date || r.createdAt || null;
          const startTime = r.startTime || r.time || null;
          const endTime = r.endTime || null;
          const normalizedStatus = computeStatus(dateStr, startTime, endTime);

          const rawStudentName =
            r.studentName || profileName || r.studentId || r.student || null;
          const studentName =
            typeof rawStudentName === "string" &&
            rawStudentName.trim().length > 0
              ? rawStudentName
              : r.studentId
              ? `Student ${String(r.studentId).slice(0, 6)}...`
              : "Student";

          return {
            id: r._id || r.id || Math.random().toString(36).slice(2, 9),
            title: r.title || r.name || "Untitled session",
            studentName,
            instructorName: r.mentor?.name || r.instructorName || "Mentor",
            instructorAvatar:
              r.mentor?.image || r.instructorAvatar || "/assets/Avatar.png",
            date: dateStr,
            startTime,
            endTime,
            meetingUrl: r.meetingLink || r.meetingUrl || r.meeting || "",
            status: normalizedStatus,
          };
        });

        mapped.sort((a, b) => {
          const sa = statusWeight(a.status);
          const sb = statusWeight(b.status);
          if (sa !== sb) return sa - sb;
          const da = new Date(a.date || 0).getTime();
          const db = new Date(b.date || 0).getTime();
          if (da !== db) return da - db;
          const ta = (a.startTime || "00:00").split(":").map(Number);
          const tb = (b.startTime || "00:00").split(":").map(Number);
          const atMin = (ta[0] || 0) * 60 + (ta[1] || 0);
          const btMin = (tb[0] || 0) * 60 + (tb[1] || 0);
          return atMin - btMin;
        });

        if (mounted) setSessions(mapped);
      } catch (err) {
        console.error("Failed loading sessions:", err);
        if (mounted) {
          setSessions([
            {
              id: "ls-1",
              title: "Admissions Q&A: Computer Science",
              studentName: "Asha Patel",
              instructorName: "Dr. Sarah Thompson",
              instructorAvatar: "/assets/Avatar.png",
              date: new Date().toISOString(),
              startTime: "11:00",
              endTime: "12:00",
              meetingUrl: "https://meet.example.com/ls-1",
              status: "ongoing",
            },
          ]);
          toast.error("Could not load sessions — showing sample.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      ongoing: sessions.filter((s) => s.status === "ongoing").length,
      current: sessions.filter((s) => s.status === "current").length,
      past: sessions.filter((s) => s.status === "past").length,
    }),
    [sessions]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sessions.filter((s) => {
      if (filter && s.status !== filter) return false;
      if (!q) return true;
      return (
        (s.title || "").toLowerCase().includes(q) ||
        (s.studentName || "").toLowerCase().includes(q) ||
        (s.instructorName || "").toLowerCase().includes(q)
      );
    });
  }, [sessions, filter, query]);

  function formatDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function handleJoin(url) {
    if (!url) return toast.error("No meeting URL available");
    window.open(url, "_blank");
  }

  const FilterButton = ({ label, keyName, count }) => {
    const active = filter === keyName;
    return (
      <button
        onClick={() => setFilter(keyName)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
          active
            ? "border border-purple-600 bg-white text-purple-600"
            : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
        }`}
      >
        {label}
        <span className="text-xs text-gray-400">({count})</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              Live Sessions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Watch and manage live sessions — join Q&As, webinars and panels.
            </p>
          </div>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sessions, students or instructors..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm placeholder-gray-400"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-600 mr-2">Filters:</span>
          <FilterButton
            label="Ongoing"
            keyName="ongoing"
            count={counts.ongoing}
          />
          <FilterButton
            label="Current"
            keyName="current"
            count={counts.current}
          />
          <FilterButton label="Past" keyName="past" count={counts.past} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-sm text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Session</th>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Instructor</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    Loading sessions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No sessions found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 flex-shrink-0">
                        <Video size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="text-gray-800 font-medium">
                          {s.title}
                        </div>
                        <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {s.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {s.studentName}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={s.instructorAvatar || "/assets/Avatar.png"}
                          alt={s.instructorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-700">
                          {s.instructorName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(s.date)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {s.startTime && s.endTime
                        ? `${s.startTime} - ${s.endTime}`
                        : s.time || "TBA"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-6">
                        <button
                          onClick={() => handleJoin(s.meetingUrl)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 text-sm"
                        >
                          <Play size={14} /> Join
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
            <div>
              Showing <span className="font-medium">{filtered.length}</span>{" "}
              sessions
            </div>
            <div>Page 1 of 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
