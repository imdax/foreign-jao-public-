import React, { useState } from "react";

export default function TestPaperForm() {
  const questions = [
    { id: 1, question: "Explain the difference between HTTP and HTTPS." },
    { id: 2, question: "Write a short note on React Components." },
    { id: 3, question: "What are the advantages of cloud computing?" },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 mt-10">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-6">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">Test Paper</h1>
        <p className="text-gray-600 mb-6">Please answer all questions below.</p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className=" p-4 rounded-lg">
                <label className="block text-lg font-medium text-gray-800 mb-2">
                  {q.id}. {q.question}
                </label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Your Answers:
            </h2>
            <ul className="space-y-4">
              {questions.map((q) => (
                <li key={q.id} className="border p-4 rounded-lg bg-gray-50">
                  <p className="font-medium">
                    {q.id}. {q.question}
                  </p>
                  <p className="text-gray-700 mt-1">
                    {answers[q.id] || "No answer provided"}
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
