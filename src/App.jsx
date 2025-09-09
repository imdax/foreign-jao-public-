// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Head from "./Components/Head";
import { menuItems } from "./menuConfig";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import TestDetailPage from "./Components/TestDetailPage";
import TestSummaryPage from "./Pages/TestSummaryPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import AuthRoute from "./Components/AuthRoute";
import { Toaster } from "react-hot-toast";
import CourseDetails from "./Pages/CourseDetails";
// NOTE: make sure this import path matches the actual file name (case-sensitive on some OSes)
import CollegeDetails from "./Pages/Collegedetails";

// EnrolledCourse page (user lands here when clicking an enrolled card)
import EnrolledCourse from "./Pages/EnrolledCourse";

function App() {
  const location = useLocation();

  // Paths where global Head + Sidebar should be hidden (auth pages only)
  const authPaths = ["/", "/login", "/signup"];
  const hideForAuth = authPaths.includes(location.pathname);

  // Hide only the sidebar on enrolled pages (but keep header visible)
  // Also hide sidebar on test detail pages: /tests/:id (but NOT on /tests)
  const isEnrolledPage = location.pathname.startsWith("/enrolled/");
  const isTestDetailPage = (() => {
    // match /tests/:id  where :id is non-empty and not another segment
    // examples matched: /tests/abc123, /tests/68c01ee74c5f585cab5d139e
    // not matched: /tests or /tests/ or /tests/something/more
    const m = location.pathname.match(/^\/tests\/([^/]+)$/);
    return !!m;
  })();

  const hideSidebar = isEnrolledPage || isTestDetailPage;

  return (
    <div className="flex">
      {/* Head is visible on all non-auth pages (includes /enrolled/* and /tests/:id) */}
      {!hideForAuth && <Head />}

      {/* Sidebar is hidden on auth pages and also on enrolled pages and test detail pages */}
      {!hideForAuth && !hideSidebar && <Sidebar />}

      <main
        className={`flex-1 pt-12 ${
          !hideForAuth && !hideSidebar ? "ml-16 md:ml-64" : ""
        } p-6`}
      >
        <Routes>
          {/* ✅ Auth Pages */}
          <Route
            path="/"
            element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            }
          />

          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <TestSummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests/:id"
            element={
              <ProtectedRoute>
                <TestDetailPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Course Details Page */}
          <Route
            path="/course/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />

          {/* ✅ Enrolled Course Page (opens when clicking an enrolled card) */}
          <Route
            path="/enrolled/:courseId"
            element={
              <ProtectedRoute>
                <EnrolledCourse />
              </ProtectedRoute>
            }
          />

          {/* ✅ College Details Page */}
          <Route
            path="/colleges/:id"
            element={
              <ProtectedRoute>
                <CollegeDetails />
              </ProtectedRoute>
            }
          />

          {/* ✅ Dashboard Pages */}
          {menuItems.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <ProtectedRoute>
                  <item.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Fallback */}
          <Route path="*" element={<RegisterPage />} />
        </Routes>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
