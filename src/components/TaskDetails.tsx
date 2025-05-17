import React from "react";
import type { Task } from "@/types";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-900">
            Created: {formatDate(task.createdAt)}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2 font-gray-900">Description</h3>
          <div className="bg-gray-50 p-3 rounded">
            {task.description ? (
              <p className="whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-gray-400 italic">No description provided</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
