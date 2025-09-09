import React from "react";
import SearchBar from "./Search";
function Head() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-12 bg-white shadow-md z-40 flex justify-between items-center px-4">
      <div className="text-purple-700">Foreign Jao</div>

      <div className="flex-grow flex justify-center">
        <SearchBar />
      </div>

      <div className="flex items-center space-x-3">
        <button>
          <img src="/assets/Nav item.png" className="w-8 h-8" />
        </button>
        <button>
          <img src="/assets/My Tasks.png" className="w-8 h-8" />
        </button>
      </div>
    </nav>
  );
}

export default Head;
