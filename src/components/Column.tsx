import React, { useState, useRef, useEffect } from "react";
import { useKanbanStore } from "@h/kanbanStore";
import Task from "@c/Task";
import type { Column as ColumnType } from "@/types";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import AddTask from "@c/AddTask";

interface ColumnProps {
  column: ColumnType;
  index: number;
}

const Column: React.FC<ColumnProps> = ({ column, index }) => {
  const { tasks, updateColumn, deleteColumn, moveTask } = useKanbanStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const columnRef = useRef<HTMLDivElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const columnTasks = column.tasks
    .map((taskId) => tasks[taskId])
    .filter((task) => task) // Filter out any undefined tasks
    .sort((a, b) => a.order - b.order);

  const handleSave = () => {
    updateColumn(column.id, title);
    setIsEditing(false);
  };

  // Make column draggable
  useEffect(() => {
    if (!columnRef.current) return;

    const cleanup = draggable({
      element: columnRef.current,
      dragHandle: columnRef.current.querySelector(
        ".column-drag-handle"
      ) as HTMLElement,
      getInitialData: () => ({
        type: "column",
        id: column.id,
        index,
      }),
    });

    return cleanup;
  }, [column.id, index]);

  // Make column droppable for tasks
  useEffect(() => {
    if (!dropAreaRef.current) return;

    const cleanup = dropTargetForElements({
      element: dropAreaRef.current,
      getData: () => ({
        type: "column",
        id: column.id,
      }),
      onDragEnter: ({ source, location }) => {
        if (source.data.type !== "task") return;

        attachClosestEdge({
          element: dropAreaRef.current,
          input: location,
          allowedEdges: ["top", "bottom"],
        });
      },
      onDrop: ({ source, location }) => {
        if (source.data.type !== "task") return;

        const taskId = source.data.id;
        const sourceColumnId = source.data.columnId;
        const edge = extractClosestEdge(location);

        // Calculate new order based on the edge
        let newOrder = 0;

        if (edge === "bottom") {
          newOrder = columnTasks.length;
        } else if (column.tasks.length > 0) {
          const firstTaskId = column.tasks[0];
          const firstTask = tasks[firstTaskId];
          newOrder = firstTask ? firstTask.order : 0;
        }

        if (sourceColumnId !== column.id || newOrder !== source.data.order) {
          moveTask(taskId, sourceColumnId, column.id, newOrder);
        }
      },
    });

    return cleanup;
  }, [column.id, column.tasks, columnTasks.length, moveTask, tasks]);

  return (
    <div
      ref={columnRef}
      className="flex flex-col w-86 h-105 rounded-lg bg-slate-400 shadow"
    >
      <div className="p-3 bg-gray-700 rounded-t-lg flex justify-between items-center column-drag-handle">
        {isEditing ? (
          <div className="flex w-full">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-2 py-1 rounded"
              autoFocus
            />
            <button
              className="ml-2 px-2 py-1 bg-blue-500 text-gray-200 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-medium">{column.title}</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-300 rounded h-9 w-12 flex place-content-center items-center"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this column?"
                    )
                  ) {
                    deleteColumn(column.id);
                  }
                }}
                className="p-1 hover:bg-gray-300 rounded h-9 w-12 flex place-content-center items-center"
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>

      <div
        ref={dropAreaRef}
        className="flex-1 p-2 min-h-[200px] task-drop-area"
      >
        {columnTasks.map((task, taskIndex) => (
          <Task key={task.id} task={task} index={taskIndex} />
        ))}
      </div>

      <div className="p-2 border-t">
        <AddTask columnId={column.id} />
      </div>
    </div>
  );
};

export default Column;
