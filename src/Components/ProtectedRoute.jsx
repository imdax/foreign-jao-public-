import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // ❌ Not logged in → send to login
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → show the page
  return children;
};

export default ProtectedRoute;
