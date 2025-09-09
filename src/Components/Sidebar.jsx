import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuItems } from "../menuConfig";

const ICON_SIZE = "h-5 w-5"; // Smaller icon size

const Sidebar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="fixed top-12 left-0 h-[calc(100vh-3rem)] bg-white z-30 p-2 shadow-md w-14 md:w-60 transition-all duration-300">
      <ul className="space-y-1.5">
        {menuItems.map((item) => {
          // ✅ Active if path matches OR if current URL starts with the item path
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          const isHovered = hoveredItem === item.name;

          const iconSrc = `/assets/${item.icon}${
            isActive || isHovered ? "-white" : ""
          }.png`;

          return (
            <li key={item.name}>
              <Link
                to={item.path}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group w-full flex items-center md:gap-2.5 px-3 py-2 rounded-md transition-colors select-none
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary hover:text-white"
                  }`}
              >
                {/* Icon */}
                <span
                  className={`${ICON_SIZE} shrink-0 inline-flex items-center justify-center`}
                >
                  <img
                    src={iconSrc}
                    alt={item.name}
                    className="h-full w-full object-contain"
                    draggable="false"
                  />
                </span>

                {/* Label */}
                <span className="hidden md:inline text-[14px] leading-none">
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
