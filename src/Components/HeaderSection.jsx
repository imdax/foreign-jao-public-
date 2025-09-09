import React, { useEffect, useState } from "react";

const HeaderSection = ({ averageScore }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (averageScore === undefined) return;

    let start = 0;
    const duration = 1200; // animation duration in ms
    const stepTime = 20; // update every 20ms
    const steps = duration / stepTime;
    const increment = averageScore / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= averageScore) {
        clearInterval(interval);
        setDisplayScore(averageScore);
      } else {
        setDisplayScore(start);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [averageScore]);

  return (
    <div className="mt-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Your average score is{" "}
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
          {displayScore.toFixed(2)}%
        </span>
      </h1>
      <p className="text-sm sm:text-base text-gray-500 mt-1">
        View your score record & apply for new tests
      </p>
    </div>
  );
};

export default HeaderSection;
