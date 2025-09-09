// src/Components/ApplyModal.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import API_BASE from "../config";

export default function ApplyModal({ open, onClose, college, activeCourse }) {
  const [loadingPrefill, setLoadingPrefill] = useState(false);
  const [prefillError, setPrefillError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    fatherName: "",
    motherName: "",
    city: "",
    state: "",
    country: "",
    currentCollege: "",
    cgpa: "",
    lastSemesterMarks: "",
    whyJoin: "",
    consent: true,
  });

  const onChange = (key) => (e) =>
    setForm((s) => ({
      ...s,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  // Lock body scroll when modal is open; restore on close/unmount
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // Prefill when modal opens using localStorage userId
  useEffect(() => {
    if (!open) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setPrefillError("No logged-in user found (userId not in localStorage).");
      return;
    }

    let cancelled = false;
    const fetchPrefill = async () => {
      setLoadingPrefill(true);
      setPrefillError("");
      try {
        const url = `${API_BASE.replace(
          /\/$/,
          ""
        )}/fetchStudentData?id=${encodeURIComponent(userId)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          let msg = `${res.status} ${res.statusText}`;
          try {
            const j = await res.json();
            if (j?.message) msg = `${msg} — ${j.message}`;
          } catch (e) {}
          throw new Error(msg);
        }

        const payload = await res.json();
        const data = payload?.data || payload;
        if (!data) throw new Error("No prefill data returned by server");

        if (cancelled) return;

        setForm((prev) => ({
          ...prev,
          name: data.name ?? prev.name,
          email: data.email ?? prev.email,
          phone: data.phone ?? data.mobile ?? prev.phone,
          fatherName: data.fatherName ?? data.father_name ?? prev.fatherName,
          motherName: data.motherName ?? data.mother_name ?? prev.motherName,
          city: data.city ?? prev.city,
          state: data.state ?? prev.state,
          country: data.country ?? prev.country,
          currentCollege:
            data.currentCollege ?? data.current_college ?? prev.currentCollege,
          cgpa: data.cgpa ?? prev.cgpa,
          lastSemesterMarks:
            data.lastSemesterMarks ??
            data.last_semester_marks ??
            prev.lastSemesterMarks,
        }));
      } catch (err) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error("ApplyModal prefill error:", err);
          setPrefillError(err.message || "Failed to load student details");
        }
      } finally {
        if (!cancelled) setLoadingPrefill(false);
      }
    };

    fetchPrefill();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // simple client-side validators
  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const validatePhone = (value) => /^\+?[0-9\s\-]{7,15}$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setSubmitError("No logged-in user found (userId not in localStorage).");
      setSubmitLoading(false);
      return;
    }

    if (!form.name.trim() || !form.email.trim()) {
      setSubmitError("Please provide your name and email.");
      setSubmitLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      setSubmitError("Please enter a valid email address.");
      setSubmitLoading(false);
      return;
    }

    if (form.phone && !validatePhone(form.phone)) {
      setSubmitError("Please enter a valid phone number.");
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        studentId: userId,
        collegeId: college?._id || college?.id || null,
        courseId: activeCourse?._id || activeCourse?.id || null,
        applicant: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          fatherName: form.fatherName.trim(),
          motherName: form.motherName.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          currentCollege: form.currentCollege.trim(),
          cgpa: form.cgpa.trim(),
          lastSemesterMarks: form.lastSemesterMarks.trim(),
          whyJoin: form.whyJoin.trim(),
          consent: form.consent,
        },
      };

      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          if (j?.message) msg = `${msg} — ${j.message}`;
        } catch (e) {}
        throw new Error(msg);
      }

      const rsp = await res.json();
      if (rsp?.ok === false)
        throw new Error(rsp?.message || "Application failed");

      setSubmitSuccess("Application submitted successfully.");
      // close shortly after success
      setTimeout(() => {
        setSubmitSuccess("");
        onClose();
      }, 900);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("ApplyModal submit error:", err);
      setSubmitError(err.message || "Failed to submit application.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // common input classes (border gray-300 + subtle focus ring)
  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal card */}
      <div className="relative z-60 w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              Apply to {college?.name ?? "this college"}
            </h3>
            <p className="text-sm text-gray-500">
              Course:{" "}
              <span className="font-medium text-gray-700">
                {activeCourse?.name ?? "Selected course"}
              </span>
            </p>
          </div>

          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        {loadingPrefill ? (
          <div className="py-8 text-center text-gray-600">
            Loading your details…
          </div>
        ) : prefillError ? (
          <div className="p-3 bg-red-50 text-red-700 rounded mb-4">
            {prefillError}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitSuccess && (
              <div className="p-3 bg-green-50 text-green-700 rounded">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="p-3 bg-red-50 text-red-700 rounded">
                {submitError}
              </div>
            )}

            {/* Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Student name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={onChange("name")}
                  className={inputClass}
                  placeholder="Your full name"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  className={inputClass}
                  placeholder="you@example.com"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Contact & parent info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Father's name
                </label>
                <input
                  type="text"
                  value={form.fatherName}
                  onChange={onChange("fatherName")}
                  className={inputClass}
                  placeholder="Father's full name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Mother's name
                </label>
                <input
                  type="text"
                  value={form.motherName}
                  onChange={onChange("motherName")}
                  className={inputClass}
                  placeholder="Mother's full name"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={onChange("city")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={onChange("state")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={onChange("country")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Education snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Current college
                </label>
                <input
                  type="text"
                  value={form.currentCollege}
                  onChange={onChange("currentCollege")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">CGPA</label>
                <input
                  type="text"
                  value={form.cgpa}
                  onChange={onChange("cgpa")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Last semester marks
                </label>
                <input
                  type="text"
                  value={form.lastSemesterMarks}
                  onChange={onChange("lastSemesterMarks")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Why do you want to join this college?
              </label>
              <textarea
                value={form.whyJoin}
                onChange={onChange("whyJoin")}
                className={`${inputClass} min-h-[110px]`}
                rows={5}
                placeholder="Briefly explain your motivation and what you hope to achieve"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className={`px-4 py-2 rounded text-white ${
                  submitLoading
                    ? "bg-gray-400"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {submitLoading ? "Sending…" : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
