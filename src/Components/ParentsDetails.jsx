import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_BASE from "../config";
export default function ParentsDetails({ student, setStudent }) {
  const [saving, setSaving] = useState(false);

  const [fatherName, setFatherName] = useState(student?.fatherName || "");
  const [fatherContact, setFatherContact] = useState(
    student?.fatherContact || ""
  );
  const [motherName, setMotherName] = useState(student?.motherName || "");
  const [motherContact, setMotherContact] = useState(
    student?.motherContact || ""
  );
  const [guardianName, setGuardianName] = useState(student?.guardianName || "");
  const [guardianContact, setGuardianContact] = useState(
    student?.guardianContact || ""
  );

  useEffect(() => {
    setFatherName(student?.fatherName || "");
    setFatherContact(student?.fatherContact || "");
    setMotherName(student?.motherName || "");
    setMotherContact(student?.motherContact || "");
    setGuardianName(student?.guardianName || "");
    setGuardianContact(student?.guardianContact || "");
  }, [student]);

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
          fatherName,
          fatherContact,
          motherName,
          motherContact,
          guardianName,
          guardianContact,
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to update parent details");

      setStudent(result.data);
      toast.success("Parent details updated!");
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
              Parents & Guardians
            </p>
            <p className="text-sm text-gray-400">
              Update your parent and guardian details
            </p>
          </div>

          {/* Right card */}
          <div className="w-3/4 border border-gray-200 rounded-xl p-6 bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Father's Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Father's Contact
                  </label>
                  <input
                    type="text"
                    value={fatherContact}
                    onChange={(e) => setFatherContact(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Mother's Name</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Mother's Contact
                  </label>
                  <input
                    type="text"
                    value={motherContact}
                    onChange={(e) => setMotherContact(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">
                    Guardian's Name
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Guardian's Contact
                  </label>
                  <input
                    type="text"
                    value={guardianContact}
                    onChange={(e) => setGuardianContact(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setFatherName(student?.fatherName || "");
                    setFatherContact(student?.fatherContact || "");
                    setMotherName(student?.motherName || "");
                    setMotherContact(student?.motherContact || "");
                    setGuardianName(student?.guardianName || "");
                    setGuardianContact(student?.guardianContact || "");
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
