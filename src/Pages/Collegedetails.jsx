// src/Pages/CollegeDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
import CollegeHeader from "../Components/CollegeHeader";
import CourseTab from "../Components/CourseTab";

export default function CollegeDetails() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [images, setImages] = useState([]);
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    async function fetchCollege() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE}/colleges/${encodeURIComponent(id)}`,
          {
            signal: ac.signal,
          }
        );

        if (!res.ok) {
          let text = `${res.status} ${res.statusText}`;
          try {
            const errJson = await res.json();
            if (errJson?.message) text = `${text} — ${errJson.message}`;
          } catch (e) {}
          throw new Error(text);
        }

        const payload = await res.json();

        // DEBUG: raw payload from backend
        // eslint-disable-next-line no-console
        console.log("CollegeDetails.fetch -> payload:", payload);

        const data = payload?.data || payload;
        if (!data) throw new Error("No college data received");
        if (!mounted) return;

        // Normalize top-level college object
        const normalizedCollege = {
          _id: data._id || data.id,
          name: data.name || data.title,
          address: data.address || {},
          gallery: Array.isArray(data.gallery)
            ? data.gallery
            : data.gallery
            ? [data.gallery]
            : [],
          logo: data.logo || data.logoUrl || data.image || null,
          raw: data,
          ...data,
        };

        // Ensure courses is an array (fall back to empty array)
        normalizedCollege.courses = Array.isArray(data.courses)
          ? data.courses
          : [];

        // DEBUG: inspect normalized college before setting state
        // eslint-disable-next-line no-console
        console.log(
          "CollegeDetails -> normalizedCollege (pre-set):",
          normalizedCollege
        );

        setCollege(normalizedCollege);

        // choose images priority: college.gallery -> first course.gallery -> []
        const imgs =
          normalizedCollege.gallery.length > 0
            ? normalizedCollege.gallery
            : Array.isArray(data.courses?.[0]?.gallery) &&
              data.courses[0].gallery.length > 0
            ? data.courses[0].gallery
            : [];
        setImages(imgs);

        // reset to first course when data arrives
        setActiveCourseIndex(0);
      } catch (err) {
        if (err.name !== "AbortError" && mounted) {
          // eslint-disable-next-line no-console
          console.error("CollegeDetails.fetch error:", err);
          setError(err.message || "Failed to load college details.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCollege();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, [id]);

  // Loading / error / empty states
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen ml-0 mt-10 p-6">
        <div className="animate-pulse max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="h-64 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen ml-0 mt-10 p-6">
        <div className="max-w-4xl p-6 bg-white border rounded-xl text-red-600">
          Error loading college details: {error}
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="bg-gray-50 min-h-screen ml-0 mt-10 p-6">
        <div className="max-w-4xl p-6 bg-white border rounded-xl text-gray-600">
          College not found.
        </div>
      </div>
    );
  }

  // pass the courses array as-is; CourseTab is prop-aware
  const courses = college.courses || [];

  // DEBUG render-time check
  // eslint-disable-next-line no-console
  console.log(
    "CollegeDetails render -> id:",
    id,
    "college:",
    college?._id,
    "courses.length:",
    courses.length
  );

  return (
    <div>
      {/* Header: pass college, images, course info */}
      <CollegeHeader
        college={college}
        images={images}
        courses={courses}
        activeCourseIndex={activeCourseIndex}
        setActiveCourseIndex={setActiveCourseIndex}
      />

      {/* CourseTab will render the UI cards and receives the fetched courses */}
      <CourseTab
        courses={courses}
        activeCourseIndex={activeCourseIndex}
        setActiveCourseIndex={setActiveCourseIndex}
      />
    </div>
  );
}
