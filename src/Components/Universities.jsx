import React, { useEffect, useState } from "react";
import UniversityCard from "../Components/UniCard";
import API_BASE from "../config";
// API
const API_URL = `${API_BASE}/colleges`;
const BASE_LOGO_URL = "";

// ✅ Direct path from public/assest
const placeholderLogo = "/assets/university-placeholder.png";

// Random fallback generators
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

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            key: item._id || item.id || idx,
            id: item._id || item.id || `${idx}`, // ensure id prop is passed
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
            raw: item,
          };
        });

        setUniversities(normalized);
      } catch (err) {
        if (err.name !== "AbortError")
          setError(err.message || "Failed to load colleges.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse border rounded-xl p-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-3 bg-gray-100 rounded w-full mb-1" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-xl text-red-600 bg-red-50">
        Failed to fetch universities: {error}
      </div>
    );
  }

  if (!universities.length) {
    return (
      <div className="p-4 border rounded-xl text-gray-600">
        No universities found.
      </div>
    );
  }

  return (
    <div className="bg-transparent w-full mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.slice(0, 6).map((u) => (
          <UniversityCard key={u.key} {...u} />
        ))}
      </div>
    </div>
  );
}
