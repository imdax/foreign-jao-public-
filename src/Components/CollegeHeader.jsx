// src/Components/CollegeHeader.jsx
import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import ApplyModal from "./ApplyModal";

/**
 * CollegeHeader
 * Props:
 *  - college: {} (object returned from API)
 *  - images: string[] (gallery images, optional)
 *  - courses: array (optional) - used to get course-specific apply link/name
 *  - activeCourseIndex: number
 *  - setActiveCourseIndex: function
 */
const CollegeHeader = ({
  college = null,
  images = [],
  courses = [],
  activeCourseIndex = 0,
  setActiveCourseIndex = undefined,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const fallbackImages = [
    "/assets/Rectangle 1.png",
    "/assets/Rectangle 2.png",
    "/assets/Rectangle 3.png",
  ];

  const mainImages =
    Array.isArray(images) && images.length > 0 ? images : fallbackImages;

  const logoSrc =
    (college && (college.logo || college.logoUrl || college.image)) ||
    "/assets/university-placeholder.png";

  const collegeName = college?.name || college?.title || "Unnamed College";
  const addressParts = [
    college?.address?.city,
    college?.address?.state,
    college?.address?.country,
  ].filter(Boolean);
  const collegeLocation =
    addressParts.length > 0
      ? addressParts.join(", ")
      : "Location not specified";

  const activeCourse =
    (Array.isArray(courses) && courses[activeCourseIndex]) || null;

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [mainImages.length]);

  useEffect(() => {
    if (currentImageIndex >= mainImages.length) setCurrentImageIndex(0);
  }, [currentImageIndex, mainImages.length]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % mainImages.length);
  }, [mainImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      mainImages.length === 0
        ? 0
        : (prev - 1 + mainImages.length) % mainImages.length
    );
  }, [mainImages.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setApplyModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextImage, prevImage]);

  const thumbnailImages = mainImages.slice(0, 6);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-start p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-2 bg-white/0" aria-hidden>
            <ArrowLeft size={24} className="text-gray-600" />
          </div>

          <div className="flex items-center gap-4">
            {/* <img
              src={logoSrc}
              alt={`${collegeName} logo`}
              className="w-16 h-16 object-cover rounded-md border"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/university-placeholder.png";
              }}
            /> */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {collegeName}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <img
                  src="/assets/US.png"
                  alt="flag"
                  className="w-6 h-4 object-contain"
                />
                <span>{collegeLocation}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          {Array.isArray(courses) &&
            courses.length > 1 &&
            typeof setActiveCourseIndex === "function" && (
              <select
                value={activeCourseIndex}
                onChange={(e) => setActiveCourseIndex(Number(e.target.value))}
                className="border rounded-md px-3 py-2 text-sm"
              >
                {courses.map((c, i) => (
                  <option key={c._id || c.id || c.name || i} value={i}>
                    {c.name || `Course ${i + 1}`}
                  </option>
                ))}
              </select>
            )}

          <button
            type="button"
            onClick={() => setApplyModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700"
          >
            <ExternalLink size={18} />
            <span>Apply Now</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex p-6 gap-6 max-w-7xl mx-auto">
        <div className="flex-1 relative">
          <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={mainImages[currentImageIndex]}
              alt={`${collegeName} image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImages[0];
              }}
            />

            {mainImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-50 pointer-events-auto"
                >
                  <ArrowLeft size={20} className="text-gray-700" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-50 pointer-events-auto"
                >
                  <ArrowRight size={20} className="text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="w-48 space-y-4">
          {thumbnailImages.map((image, index) => (
            <div
              key={index}
              className="relative cursor-pointer"
              onClick={() => setCurrentImageIndex(index)}
            >
              <div
                className={`w-full h-24 rounded-lg overflow-hidden border ${
                  index === currentImageIndex
                    ? "ring-2 ring-purple-300"
                    : "bg-gray-200"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      fallbackImages[index] || fallbackImages[0];
                  }}
                />
              </div>
              {index === thumbnailImages.length - 1 &&
                mainImages.length > thumbnailImages.length && (
                  <div className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded">
                    +{mainImages.length - thumbnailImages.length}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Apply modal */}
      <ApplyModal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        college={college}
        activeCourse={activeCourse}
      />
    </div>
  );
};

export default CollegeHeader;
