export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
  order: number;
}

export interface KanbanState {
  columns: Column[];
  tasks: Record<string, Task>;

  // Actions
  addTask: (columnId: string, task: Partial<Task>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newOrder: number
  ) => void;
  addColumn: (title: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (sourceIndex: number, destinationIndex: number) => void;
}
