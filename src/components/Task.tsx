import { useKanbanStore } from "@h/kanbanStore";
import { useTaskDragAndDrop } from "@h/useDragAndDrop";

export const Task = ({ task, columnId }) => {
  const { deleteTask } = useKanbanStore();
  const taskRef = useTaskDragAndDrop(task.id, columnId);

  return (
    <div ref={taskRef} className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
};
