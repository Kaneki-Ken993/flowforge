import React, { useState, useRef, useEffect } from "react";
import { useKanbanStore } from "@h/kanbanStore";
import type { Task as TaskType } from "@/types";
import TaskDetails from "@c/TaskDetails";
import EditTask from "@c/EditTask";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

interface TaskProps {
  task: TaskType;
  index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
  const { deleteTask, moveTask } = useKanbanStore();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const taskRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
    }
  };

  // Make task draggable
  useEffect(() => {
    if (!taskRef.current) return;

    const cleanup = draggable({
      element: taskRef.current,
      getInitialData: () => ({
        type: "task",
        id: task.id,
        columnId: task.columnId,
        order: index,
      }),
    });

    // Make task a drop target for other tasks
    const dropCleanup = dropTargetForElements({
      element: taskRef.current,
      getData: () => ({
        type: "task",
        id: task.id,
        columnId: task.columnId,
        order: index,
      }),
      onDragEnter: ({ source, location }) => {
        if (source.data.type !== "task") return;

        attachClosestEdge(location, ["top", "bottom"]);
      },
      onDrop: ({ source, location }) => {
        if (source.data.type !== "task") return;

        const taskId = source.data.id;
        const sourceColumnId = source.data.columnId;
        const edge = extractClosestEdge(location);

        // Calculate new order based on edge
        let newOrder = index;
        if (edge === "bottom") {
          newOrder = index + 1;
        }

        if (
          sourceColumnId !== task.columnId ||
          source.data.order !== newOrder
        ) {
          moveTask(taskId, sourceColumnId, task.columnId, newOrder);
        }
      },
    });

    return () => {
      cleanup();
      dropCleanup();
    };
  }, [task.id, task.columnId, index, moveTask]);

  return (
    <>
      <div
        ref={taskRef}
        className="mb-2 p-3 bg-indigo-600 rounded-md shadow task-item"
      >
        <div className="flex justify-between">
          <h4 className="font-medium">{task.title}</h4>
          <div className="flex space-x-1">
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="text-gray-600 hover:text-gray-900 h-9 w-12 flex place-content-center items-center"
            >
              👁️
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-900 h-9 w-12 flex place-content-center items-center"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-600 hover:text-gray-900 h-9 w-12 flex place-content-center items-center"
            >
              🗑️
            </button>
          </div>
        </div>
        {task.description && (
          <p className="text-sm text-gray-300 mt-1 truncate">
            {task.description}
          </p>
        )}
      </div>

      {isDetailsOpen && (
        <TaskDetails task={task} onClose={() => setIsDetailsOpen(false)} />
      )}

      {isEditing && (
        <EditTask task={task} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
};

export default Task;
