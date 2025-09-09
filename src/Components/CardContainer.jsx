import React from "react";

const CardContainer = ({ children }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">{children}</div>
  );
};

export default CardContainer;
