import React, { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import API_BASE from "../config";
export default function ProfileDetails({ student, setStudent }) {
  const [saving, setSaving] = useState(false);

  // Controlled form state
  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const [mobile, setMobile] = useState(student?.mobile || "");

  // For inline message
  const [successMessage, setSuccessMessage] = useState("");

  // Toggle this flag to switch between inline vs toast
  const useInlineMessage = false; // ✅ set to true for inline message

  // Sync with parent updates
  useEffect(() => {
    setName(student?.name || "");
    setEmail(student?.email || "");
    setMobile(student?.mobile || "");
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student?._id) {
      toast.error("No student ID found, cannot update");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/updateStudentData`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: student._id,
          name,
          email,
          mobile,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to update data");

      // ✅ Update parent state
      setStudent(result.data);

      if (useInlineMessage) {
        // Inline message
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        // Floating toast
        toast.success("Profile updated successfully!", {
          style: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "16px 24px",
            borderRadius: "10px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            fontWeight: "600",
            color: "#16a34a", // Tailwind green-600
            fontSize: "15px",
            textAlign: "center",
          },
          duration: 2000,
        });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Personal Info Section */}
        <div className="flex gap-6 items-start">
          {/* Left Info Text */}
          <div className="w-1/4">
            <p className="text-sm font-medium text-gray-700">Personal info</p>
            <p className="text-sm text-gray-400">
              Update your photo and personal details.
            </p>
          </div>

          {/* Form Card */}
          <div className="w-3/4 border border-gray-200 rounded-xl p-6 bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-sm text-gray-600">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Profile Image Upload (not wired yet) */}
              <div>
                <label className="text-sm text-gray-600">Profile Image</label>
                <div className="mt-2 border border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                  <UploadCloud className="mx-auto w-6 h-6 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="text-purple-600 cursor-pointer">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
              </div>

              {/* ✅ Inline success message */}
              {successMessage && (
                <div className="text-center text-green-600 font-medium bg-green-100 py-2 px-4 rounded-lg">
                  {successMessage}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setName(student?.name || "");
                    setEmail(student?.email || "");
                    setMobile(student?.mobile || "");
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
