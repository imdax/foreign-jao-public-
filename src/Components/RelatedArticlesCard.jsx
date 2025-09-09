import React from "react";
import CardContainer from "./CardContainer";

const RelatedArticlesCard = ({ articles = [] }) => {
  return (
    <CardContainer>
      <h3 className="text-sm font-medium text-gray-800 mb-2">
        Related Articles
      </h3>
      <hr className="border-t border-gray-200 mb-2" />
      <div className="space-y-3">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="flex gap-3">
              <img
                src={article.image}
                alt="article"
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <p className="text-sm text-gray-800 truncate w-40">
                  {article.title}
                </p>
                <a
                  href={article.link}
                  className="text-xs text-purple-600 font-medium hover:underline"
                >
                  Read Article
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No articles available</p>
        )}
      </div>
    </CardContainer>
  );
};

export default RelatedArticlesCard;
