import React from "react";
import CardContainer from "./CardContainer";
import { Pencil } from "lucide-react"; // or use a custom icon

const PendingTasksCard = ({ count }) => {
  return (
    <CardContainer>
      <div className="flex flex-col items-start gap-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <Pencil size={20} className="text-purple-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Pending Tasks</p>
          <h2 className="text-2xl font-semibold text-gray-800">{count}</h2>
        </div>
      </div>
    </CardContainer>
  );
};

export default PendingTasksCard;
