// src/components/AddTask.tsx
import React, { useState } from "react";
import { useKanbanStore } from "@h/kanbanStore";

interface AddTaskProps {
  columnId: string;
}

const AddTask: React.FC<AddTaskProps> = ({ columnId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { addTask } = useKanbanStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask(columnId, {
      title: title.trim(),
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full py-2 text-gray-300 hover:bg-gray-200 rounded text-sm flex items-center justify-center"
      >
        + Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-slate-400 rounded shadow">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full p-2 border rounded mb-2 placeholder:text-gray-700 border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 border rounded mb-2 h-20 resize-none placeholder:text-gray-700 border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddTask;
