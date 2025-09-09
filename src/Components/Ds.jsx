import React from "react";
import PendingTasksCard from "./PendingTasksCard";
import TestScoreCard from "./TestScoreCard";
import RelatedArticlesCard from "./RelatedArticlesCard";

const Ds = () => {
  const scores = [
    { score: 171, subject: "IELTS" },
    { score: 171, subject: "IELTS" },
    { score: 171, subject: "IELTS" },
  ];

  const articles = [
    {
      title: "Placeholder for the article title...",
      link: "#",
      image: "/images/article1.jpg",
    },
    {
      title: "Placeholder for the article title...",
      link: "#",
      image: "/images/article1.jpg",
    },
    {
      title: "Placeholder for the article title...",
      link: "#",
      image: "/images/article1.jpg",
    },
  ];
  const randomPendingTasks = Math.floor(Math.random() * 15) + 1;
  return (
    <div className="w-80 sticky top-20 self-start space-y-6">
      <PendingTasksCard count={randomPendingTasks} />
      <TestScoreCard scores={scores} />
      <RelatedArticlesCard articles={articles} />
    </div>
  );
};

export default Ds;
