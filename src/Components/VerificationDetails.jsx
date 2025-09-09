import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_BASE from "../config";
export default function VerificationDetails({ student, setStudent }) {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("aadhar"); // "aadhar" | "pan"

  // Controlled state
  const [aadhar, setAadhar] = useState(student?.aadhar || "");
  const [otp, setOtp] = useState("");
  const [pan, setPan] = useState(student?.pan || "");

  // Sync with parent updates
  useEffect(() => {
    setAadhar(student?.aadhar || "");
    setPan(student?.pan || "");
  }, [student]);

  const handleSendOtp = () => {
    if (!aadhar) {
      toast.error("Please enter Aadhaar number first");
      return;
    }
    // 🔥 Integrate API for OTP sending
    toast.success("OTP sent successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student?._id) {
      toast.error("No student ID found");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/updateStudentData`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: student._id,
          aadhar,
          pan,
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.message || "Failed to update verification details"
        );

      // ✅ Update parent state
      setStudent(result.data);

      toast.success("Verification details updated!");
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
          {/* Left side label */}
          <div className="w-1/4">
            <p className="text-sm font-medium text-gray-700">
              Verification Details
            </p>
            <p className="text-sm text-gray-400">
              Update your Aadhaar & PAN Card details
            </p>
          </div>

          {/* Right side card */}
          <div className="w-3/4 border border-gray-200 rounded-xl p-6 bg-white">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("aadhar")}
                className={`pb-2 ${
                  activeTab === "aadhar"
                    ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                Aadhaar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pan")}
                className={`pb-2 ${
                  activeTab === "pan"
                    ? "text-purple-600 border-b-2 border-purple-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                PAN
              </button>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {activeTab === "aadhar" ? (
                <>
                  {/* Aadhaar Number */}
                  <div>
                    <label className="text-sm text-gray-600">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      value={aadhar}
                      onChange={(e) => setAadhar(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  {/* Send OTP */}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Send OTP
                  </button>

                  {/* OTP */}
                  <div>
                    <label className="text-sm text-gray-600">OTP</label>
                    <input
                      type="password"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* PAN */}
                  <div>
                    <label className="text-sm text-gray-600">PAN Number</label>
                    <input
                      type="text"
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      placeholder="ABCDE1234F"
                      className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setAadhar(student?.aadhar || "");
                    setOtp("");
                    setPan(student?.pan || "");
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
