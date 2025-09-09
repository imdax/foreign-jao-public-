import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";

export default function LogoutButton() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // ✅ Clear auth data
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    sessionStorage.clear();

    // ✅ Redirect to login
    navigate("/login");
  };

  return (
    <div className="flex justify-end">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

      {/* Overlay + Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* ✅ Overlay with fade effect */}
          <div
            className="flex-1 bg-black bg-opacity-0 transition-opacity duration-300 ease-out"
            onClick={() => setIsOpen(false)}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          ></div>

          {/* ✅ Slide-in Panel */}
          <div className="w-full max-w-md h-full bg-white shadow-xl transform transition-transform duration-300 ease-out translate-x-0">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-600" />
                Log out
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to log out? You’ll need to sign in again
                to access your dashboard.
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Yes, Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
