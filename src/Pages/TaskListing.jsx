import React from "react";
import Task from "../Components/Task";
import Info from "../Components/Info";

function TaskListing() {
  return (
    <div>
      <Info />
      <div className="ml-60">
        <Task />
      </div>
    </div>
  );
}

export default TaskListing;
