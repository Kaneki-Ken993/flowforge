// src/store/kanbanStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { KanbanState, Column, Task } from "@/types";

// Initial data structure
const initialState = {
  columns: [
    { id: "1", title: "To Do", tasks: [], order: 0 },
    { id: "2", title: "In Progress", tasks: [], order: 1 },
    { id: "3", title: "Done", tasks: [], order: 2 },
  ] as Column[],
  tasks: {} as Record<string, Task>,
};

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, _get) => ({
      // State
      columns: initialState.columns,
      tasks: initialState.tasks,

      // Actions
      addTask: (columnId, task) =>
        set((state) => {
          const newTaskId = Date.now().toString();
          const newTask: Task = {
            id: newTaskId,
            title: task.title || "New Task",
            description: task.description || "",
            createdAt: new Date().toISOString(),
            columnId,
            order: Object.keys(state.tasks).filter(
              (taskId) => state.tasks[taskId].columnId === columnId
            ).length,
            ...task,
          };

          return {
            tasks: { ...state.tasks, [newTaskId]: newTask },
            columns: state.columns.map((col) => {
              if (col.id === columnId) {
                return { ...col, tasks: [...col.tasks, newTaskId] };
              }
              return col;
            }),
          };
        }),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], ...updates },
          },
        })),

      deleteTask: (taskId) =>
        set((state) => {
          const columnId = state.tasks[taskId].columnId;
          const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;

          return {
            tasks: remainingTasks,
            columns: state.columns.map((col) => {
              if (col.id === columnId) {
                return {
                  ...col,
                  tasks: col.tasks.filter((id) => id !== taskId),
                };
              }
              return col;
            }),
          };
        }),

      moveTask: (taskId, sourceColumnId, destinationColumnId, newOrder) =>
        set((state) => {
          // Update task's column
          const updatedTask = {
            ...state.tasks[taskId],
            columnId: destinationColumnId,
            order: newOrder,
          };

          // Remove from source column
          const sourceColumn = state.columns.find(
            (col) => col.id === sourceColumnId
          )!;
          const updatedSourceColumn = {
            ...sourceColumn,
            tasks: sourceColumn.tasks.filter((id) => id !== taskId),
          };

          // Add to destination column
          const destinationColumn = state.columns.find(
            (col) => col.id === destinationColumnId
          )!;

          // Insert at the proper position
          const updatedDestTasks = [...destinationColumn.tasks];
          if (sourceColumnId === destinationColumnId) {
            // Reordering within the same column
            updatedDestTasks.splice(updatedDestTasks.indexOf(taskId), 1);
          }
          updatedDestTasks.splice(newOrder, 0, taskId);

          const updatedDestinationColumn = {
            ...destinationColumn,
            tasks: updatedDestTasks,
          };

          return {
            tasks: { ...state.tasks, [taskId]: updatedTask },
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId) return updatedSourceColumn;
              if (col.id === destinationColumnId)
                return updatedDestinationColumn;
              return col;
            }),
          };
        }),

      addColumn: (title) =>
        set((state) => {
          const newColumnId = Date.now().toString();
          const newColumn: Column = {
            id: newColumnId,
            title,
            tasks: [],
            order: state.columns.length,
          };

          return {
            columns: [...state.columns, newColumn],
          };
        }),

      updateColumn: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, title } : col
          ),
        })),

      deleteColumn: (columnId) =>
        set((state) => {
          // Get all task IDs from this column
          const column = state.columns.find((col) => col.id === columnId);
          const taskIdsToDelete = column ? column.tasks : [];

          // Create new tasks object without the tasks from this column
          const newTasks = { ...state.tasks };
          taskIdsToDelete.forEach((taskId) => {
            delete newTasks[taskId];
          });

          return {
            tasks: newTasks,
            columns: state.columns.filter((col) => col.id !== columnId),
          };
        }),

      reorderColumns: (sourceIndex, destinationIndex) =>
        set((state) => {
          const columns = [...state.columns];
          const [removed] = columns.splice(sourceIndex, 1);
          columns.splice(destinationIndex, 0, removed);

          // Update order for all columns
          return {
            columns: columns.map((col, index) => ({ ...col, order: index })),
          };
        }),
    }),
    {
      name: "kanban-storage",
    }
  )
);
