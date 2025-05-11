

export type InitialStateTypes = {
  columns: [
    { id: string; title: string; tasks: string[]; order: number },
    { id: string; title: string; tasks: string[]; order: number },
    { id: string; title: string; tasks: string[]; order: number },
    { id: string; title: string; tasks: string[]; order: number }
  ];
  tasks: Record<string, Task>;
};

export type ColumnType = {
  id: string; title: string; tasks: string[]; order: number 
}

export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  columnId: string;
  order: number;
};

export type State = {
  columns: Array<{ id: string; title: string; tasks: string[]; order: number }>;
  tasks: Record<string, Task>;
};

export type Actions = {
  addTask: (columnId: string, task: Partial<Task>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string, newOrder: number) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (sourceIndex: number, destinationIndex: number) => void;
};




// Drop and drag types

export interface DraggableProps<T> {
  data: T;
  onDragStart?: () => void;
  onDrop?: () => void;
}

export interface DroppableProps {
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  onDrop?: () => void;
}
