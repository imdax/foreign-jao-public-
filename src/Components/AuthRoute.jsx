import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  if (userId) {
    // ✅ Already logged in → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // ❌ Not logged in → show auth page
  return children;
};

export default AuthRoute;
