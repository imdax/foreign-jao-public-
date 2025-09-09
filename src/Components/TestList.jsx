import React, { useEffect, useState } from "react";
import TestCard from "./TestCard";
import API_BASE from "../config";
export default function TestList() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/tests`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setTests(data.data);
      })
      .catch((err) => console.error("Error fetching tests:", err));
  }, []);

  return (
    <div className="flex flex-wrap gap-6">
      {tests.map((test) => (
        <TestCard
          key={test._id}
          _id={test._id} // 👈 pass test id
          name={test.name}
          description={test.description}
          time={test.time}
          questions={test.assignment.length}
        />
      ))}
    </div>
  );
}
