import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PersistOptions } from "zustand/middleware/persist";
import type { InitialStateTypes, State, Actions, Task } from "@/types";

const initialState: InitialStateTypes = {
  columns: [
    { id: "1", title: "To Do0", tasks: [], order: 0 },
    { id: "2", title: "In progress", tasks: [], order: 1 },
    { id: "3", title: "Done", tasks: [], order: 2 },
    { id: "4", title: "Dropped", tasks: [], order: 3 },
  ],
  tasks: {} as Record<string, Task>,
};

const persistConfig: PersistOptions<State & Actions> = {
  name: "kanban-store",
};

export const useKanbanStore = create<State & Actions>()(
  persist(
    (set) => ({
      columns: initialState.columns,
      tasks: initialState.tasks as Record<string, Task>,

      addTask: (columnId: string, task: Partial<Task>) =>
        set((state: State) => {
          const newTaskId = Date.now().toString();
          const newTask = {
            id: newTaskId,
            title: task.title || "",
            description: task.description || "",
            createdAt: Date.now().toString(),
            columnId,
            order: Object.keys(state.tasks).filter(
              (taskId) => state.tasks[taskId].columnId === columnId
            ).length,
            ...task,
          };

          return {
            tasks: {
              ...state.tasks,
              [newTaskId]: newTask,
            },
            columns: state.columns.map((col) => {
              if (col.id === columnId) {
                return {
                  ...col,
                  tasks: [...col.tasks, newTaskId],
                };
              }
              return col;
            }),
          };
        }),

      updateTask: (taskId: string, updates: Partial<Task>) =>
        set((state: State) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], ...updates },
          },
        })),

      deleteTask: (taskId: string) =>
        set((state: State) => {
          const columnId = state.tasks[taskId].columnId;

          const { [taskId]: _deleteTask, ...remainingTasks } = state.tasks;

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

      moveTask: (
        taskId: string,
        sourceColumnId: string,
        destinationColumnId: string,
        newOrder: number
      ) =>
        set((state: State) => {
          const updatedTask = {
            ...state.tasks[taskId],
            columnId: destinationColumnId,
            order: newOrder,
          };

          const sourceColumn = state.columns.find(
            (col) => col.id === sourceColumnId
          );
          if (!sourceColumn) return state;

          const updatedSourceColumn = {
            ...sourceColumn,
            tasks: sourceColumn.tasks.filter((id) => id !== taskId),
          };

          const destinationColumn = state.columns.find(
            (col) => col.id === destinationColumnId
          );
          if (!destinationColumn) return state;

          const updatedDesTasks = [...destinationColumn.tasks];
          if (sourceColumnId === destinationColumnId) {
            updatedDesTasks.splice(updatedDesTasks.indexOf(taskId), 1);
          }
          updatedDesTasks.splice(newOrder, 0, taskId);

          const updatedDestinationColumn = {
            ...destinationColumn,
            tasks: updatedDesTasks,
          };

          return {
            tasks: {
              ...state.tasks,
              [taskId]: updatedTask,
            },
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId) {
                return updatedSourceColumn;
              }
              if (col.id === destinationColumnId) {
                return updatedDestinationColumn;
              }
              return col;
            }),
          };
        }),

      addColumn: (title: string) =>
        set((state: State) => {
          const newColumnId = Date.now().toString();
          return {
            columns: [
              ...state.columns,
              {
                id: newColumnId,
                title,
                tasks: [],
                order: state.columns.length,
              },
            ],
          };
        }),

      deleteColumn: (columnId: string) =>
        set((state: State) => {
          const column = state.columns.find((col) => col.id === columnId);
          const taskIdsToUpdate = column ? column.tasks : [];

          const newTasks = { ...state.tasks };
          taskIdsToUpdate.forEach((taskId) => {
            delete newTasks[taskId];
          });

          return {
            tasks: newTasks,
            columns: state.columns.filter((col) => col.id !== columnId),
          };
        }),

      reorderColumns: (sourceIndex: number, destinationIndex: number) =>
        set((state: State) => {
          const columns = [...state.columns];
          const [removed] = columns.splice(sourceIndex, 1);
          columns.splice(destinationIndex, 0, removed);

          return {
            columns: columns.map((col, index) => ({ ...col, order: index })),
          };
        }),
    }),
    persistConfig
  )
);
