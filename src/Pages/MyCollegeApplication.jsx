import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function MyCollegeApplication() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/applications`);
        if (!res.ok) throw new Error("No applications found");
        const payload = await res.json();
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        if (mounted) setApplications(list);
      } catch {
        if (mounted) {
          setApplications([
            {
              id: "app-1",
              collegeName: "Stanford University",
              universityImage: "/assets/university-placeholder.png",
              country: "USA",
              date: "2025-01-12",
              mentorName: "Dr. Alice Johnson",
              mentorAvatar: "/assets/Avatar.png",
              status: "approved",
            },
            {
              id: "app-2",
              collegeName: "University of Oxford",
              universityImage: "/assets/university-placeholder.png",
              country: "UK",
              date: "2025-02-15",
              mentorName: "Prof. John Smith",
              mentorAvatar: "/assets/Avatar.png",
              status: "pending",
            },
            {
              id: "app-3",
              collegeName: "National University of Singapore",
              universityImage: "/assets/university-placeholder.png",
              country: "Singapore",
              date: "2025-03-20",
              mentorName: "Dr. Sarah Tan",
              mentorAvatar: "/assets/Avatar.png",
              status: "approved",
            },
          ]);
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

  const filtered = useMemo(() => {
    if (filter === "all") return applications;
    return applications.filter((a) => a.status === filter);
  }, [applications, filter]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            My College Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your college applications, mentors, and approval status.
          </p>
        </div>

        {/* ✅ Filter Section moved below paragraph, aligned left */}
        <div className="mt-4 mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-600">Filter:</span>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-300"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-2.5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-sm text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3 text-left">College</th>
                <th className="px-6 py-3 text-left">Country</th>
                <th className="px-6 py-3 text-left">Date of Application</th>
                <th className="px-6 py-3 text-left">Mentor</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    Loading applications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id}>
                    {/* College (Name + Logo) */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          app.universityImage ||
                          "/assets/university-placeholder.png"
                        }
                        alt={app.collegeName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {app.collegeName}
                      </span>
                    </td>

                    {/* Country */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {app.country}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.date).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Mentor (Name + Avatar) */}
                    <td className="px-6 py-4 flex items-center gap-2">
                      <img
                        src={app.mentorAvatar || "/assets/Avatar.png"}
                        alt={app.mentorName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-700">
                        {app.mentorName}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
            <div>
              Showing <span className="font-medium">{filtered.length}</span>{" "}
              applications
            </div>
            <div>Page 1 of 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
