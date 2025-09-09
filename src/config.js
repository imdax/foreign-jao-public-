// src/config.js
const raw = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// remove trailing slash if present
const API_BASE = raw.replace(/\/+$/, "");

export default API_BASE;
