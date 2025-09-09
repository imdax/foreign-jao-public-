import React, { useEffect, useState } from "react";
import ProfileHeader from "../Components/ProfleHeader";
import ProfileDetails from "../Components/ProfileDetails";
import EducationDetails from "../Components/EducationDetails";
import LogoutButton from "../Components/LogoutButton";
import VerificationDetails from "../Components/VerificationDetails";
import ParentsDetails from "../Components/ParentsDetails";
import API_BASE from "../config";
function ProfilePage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(`${API_BASE}/fetchStudentData?id=${userId}`);

        if (!res.ok) throw new Error("Failed to fetch student data");

        const result = await res.json();
        if (result.ok) {
          setStudent(result.data);
        } else {
          setError("No student data found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div>
      {/* ✅ Pass student + updater to children */}
      <ProfileHeader student={student} />
      <ProfileDetails student={student} setStudent={setStudent} />
      <VerificationDetails student={student} setStudent={setStudent} />
      <EducationDetails student={student} setStudent={setStudent} />
      <ParentsDetails student={student} setStudent={setStudent} />
      <LogoutButton />
    </div>
  );
}

export default ProfilePage;
