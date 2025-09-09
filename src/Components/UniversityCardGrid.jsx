import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UniversityCard from "./UniversityCard";
import API_BASE from "../config";

const API_URL = `${API_BASE}/colleges`;
const BASE_LOGO_URL = "";
const placeholderLogo = "/assets/university-placeholder.png";

// random generators (kept from your code)
const randomTuition = () => `$${(Math.floor(Math.random() * 30) + 20) * 1000}`;
const randomSAT = () => {
  const low = Math.floor(Math.random() * 400) + 1000;
  const high = low + Math.floor(Math.random() * 200) + 100;
  return `${low}-${high}`;
};
const randomAcceptance = () => `${Math.floor(Math.random() * 40) + 30}%`;

const LOCATIONS = [
  "California, USA",
  "London, UK",
  "Sydney, Australia",
  "Toronto, Canada",
  "Berlin, Germany",
  "Paris, France",
  "Tokyo, Japan",
  "Singapore",
  "New Delhi, India",
];
const randomLocation = () =>
  LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

export default function UniversityCardGrid() {
  const [universities, setUniversities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expectedCount, setExpectedCount] = useState(3); // 👈 skeleton count from API
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(API_URL, { signal: ac.signal });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const payload = await res.json();
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.results)
          ? payload.results
          : [];

        // set skeleton count based on API result length
        if (Array.isArray(list) && list.length > 0) {
          setExpectedCount(list.length);
        }

        const normalized = list.map((item, idx) => {
          const logoRaw =
            item.logoUrl || item.logo || item.image || item.logo_path || "";

          let logoUrl = placeholderLogo;
          if (logoRaw) {
            logoUrl = logoRaw.startsWith("http")
              ? logoRaw
              : `${BASE_LOGO_URL}${logoRaw.replace(/^\/+/, "")}`;
          }

          return {
            id: item._id || item.id || idx,
            logoUrl,
            name: item.name || item.title || `Sample University ${idx + 1}`,
            location:
              item.location ||
              [item.city, item.state, item.country]
                .filter(Boolean)
                .join(", ") ||
              randomLocation(),
            tuition: item.tuition ?? item.fees ?? randomTuition(),
            satRange:
              item.satRange ?? item.sat_range ?? item.sat ?? randomSAT(),
            acceptanceRate:
              item.acceptanceRate != null
                ? `${item.acceptanceRate}%`
                : item.acceptance_rate != null
                ? `${item.acceptance_rate}%`
                : randomAcceptance(),
          };
        });

        setUniversities(normalized);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load colleges.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, []);

  // skeleton that mirrors UniversityCard layout
  const renderSkeletons = (count = 6) =>
    Array.from({ length: count }).map((_, i) => (
      <div
        key={`uni-skel-${i}`}
        className="bg-white rounded-xl shadow p-6 relative animate-pulse"
      >
        {/* top right button + heart */}
        <div className="absolute right-4 top-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="h-8 w-24 rounded-full bg-gray-200" />
        </div>

        {/* logo + name + location */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="border-t border-gray-100 my-4"></div>

        {/* bottom stats (3 cols) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    ));

  // -------- render --------
  if (loading || universities === null) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSkeletons(6)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-xl text-red-600 bg-red-50">
        Failed to fetch colleges: {error}
      </div>
    );
  }

  if (Array.isArray(universities) && universities.length === 0) {
    return (
      <div className="p-4 border rounded-xl text-gray-600">
        No colleges found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {universities.map((u) => (
        <UniversityCard
          key={u.id}
          {...u}
          onViewDetails={() => {
            console.log("Navigating to college id:", u.id);
            navigate(`/colleges/${encodeURIComponent(u.id)}`);
          }}
        />
      ))}
    </div>
  );
}
