import React from "react";
import StudentCard from "../Components/StudentCard"; // corrected name

const StudentProfile = () => {
  const cardData = {
    logo: "/assets/Avatar.png", // ✅ direct public path
    name: "Arjun V",
    location: "University of Mumbai",
    Gre: "305",
    Toefl: "107",
    UGgpa: "7.18",
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <StudentCard key={i} {...cardData} />
        ))}
      </div>
    </div>
  );
};

export default StudentProfile;
