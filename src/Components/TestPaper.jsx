import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
export default function TestPaper() {
  const { id } = useParams(); // get testId from URL
  const [test, setTest] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const studentID = "student123";

  useEffect(() => {
    fetch(`${API_BASE}/tests`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          //  Find the test that matches the clicked one
          const found = data.data.find((t) => t._id === id);
          setTest(found);
        }
      })
      .catch((err) => console.error("Error fetching tests:", err));
  }, [id]);

  useEffect(() => {
    if (!test) return;

    const interval = setInterval(() => {
      setTimeTaken((prev) => {
        const newTime = prev + 1;
        if (newTime >= test.time * 60 && !submitted) {
          handleSubmit(newTime);
          clearInterval(interval);
        }
        return newTime;
      });
    }, 1000);

    setTimer(interval);

    return () => clearInterval(interval);
  }, [test]);

  const handleAnswerChange = (qId, answer) => {
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleSubmit = (finalTime = timeTaken) => {
    clearInterval(timer);

    let correctCount = 0;
    const answersArray = test.assignment.map((q) => {
      const selected = answers[q._id] || null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        question: q.question,
        optionSelected: selected,
        correct: isCorrect,
      };
    });

    setScore(correctCount);
    setSubmitted(true);

    const resultData = {
      testID: test._id,
      studentID: studentID,
      totalMarks: test.assignment.length * 10,
      totalMarksScored: correctCount * 10,
      totalTimeGiven: test.time,
      totalTimeTaken: Math.floor(finalTime / 60),
      answers: answersArray,
    };

    console.log("Result to save:", resultData);

    fetch(`${API_BASE}/testReports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData),
    })
      .then((res) => res.json())
      .then((data) => console.log("Result saved:", data))
      .catch((err) => console.error("Error saving result:", err));
  };

  if (!test) return <div className="p-6">Loading test...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">{test.name}</h1>
      <p className="text-gray-600 mb-6">{test.description}</p>

      {test.assignment.map((q, index) => (
        <div key={q._id} className="mb-6 p-4 rounded-lg border">
          <p className="font-medium">
            Q{index + 1}. {q.question}
          </p>
          <div className="mt-2 space-y-2">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center gap-2 cursor-pointer border p-2 rounded-lg hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={opt}
                  checked={answers[q._id] === opt}
                  onChange={() => handleAnswerChange(q._id, opt)}
                  disabled={submitted}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => handleSubmit()}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Submit Test
        </button>
      ) : (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            You scored {score * 10} / {test.assignment.length * 10}
          </h2>
        </div>
      )}
    </div>
  );
}
