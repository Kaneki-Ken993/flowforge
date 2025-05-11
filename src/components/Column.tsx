import { useKanbanStore } from "@h/kanbanStore";
import { Task } from "@c/Task";
import { useColumnDragAndDrop, useDroppable } from "@h/useDragAndDrop";
import { useRef } from "react";
import type { ColumnType } from "@/types";

function Column({ column, index }: { column: ColumnType; index: number }) {
  const { tasks, moveTask } = useKanbanStore();
  const columnRef = useColumnDragAndDrop(column.id, index);
  const dropRef = useRef<HTMLElement>(null);

  useDroppable(dropRef, {
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDrop: (e: {
      data: { taskId: string; columnId: string; type: string };
    }) => {
      const { taskId, columnId: sourceColumnId, type } = e.data;

      if (type === "task" && sourceColumnId !== column.id) {
        moveTask(taskId, sourceColumnId, column.id, column.tasks.length);
      }
    },
  });

  return (
    <div ref={columnRef} className="column">
      <h2>{column.title}</h2>
      <div ref={dropRef} className="task-list">
        {column.tasks.map((taskId) => (
          <Task key={taskId} task={tasks[taskId]} columnId={column.id} />
        ))}
      </div>
    </div>
  );
}

export default Column;
