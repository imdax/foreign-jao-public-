import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_BASE from "../config";
export default function EducationDetails({ student, setStudent }) {
  const [saving, setSaving] = useState(false);

  const [school, setSchool] = useState(student?.school || "");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setSchool(student?.school || "");
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student?._id) {
      toast.error("No student ID found");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/updateStudentData`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: student._id,
          school,
          otp,
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to update education details");

      setStudent(result.data);
      toast.success("Education details updated!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex gap-6 items-start">
          {/* Left sidebar */}
          <div className="w-1/4">
            <p className="text-sm font-medium text-gray-700">
              Education Details
            </p>
            <p className="text-sm text-gray-400">
              Update your education details
            </p>
          </div>

          {/* Right card */}
          <div className="w-3/4 border border-gray-200 rounded-xl p-6 bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-gray-600">
                  School / College Name
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">OTP</label>
                <input
                  type="password"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="******"
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setSchool(student?.school || "");
                    setOtp("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
