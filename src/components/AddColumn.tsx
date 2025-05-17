// src/components/AddColumn.tsx
import React, { useState } from "react";
import { useKanbanStore } from "@h/kanbanStore";

const AddColumn: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { addColumn } = useKanbanStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addColumn(title);
    setTitle("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="h-12 w-72 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-300"
      >
        + Add Column
      </button>
    );
  }

  return (
    <div className="w-72 bg-slate-400 p-3 rounded-lg">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Column title"
          className="w-full p-2 border rounded mb-2 placeholder:text-gray-700 border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
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
    </div>
  );
};

export default AddColumn;
