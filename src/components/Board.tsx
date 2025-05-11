import { useKanbanStore } from "@h/kanbanStore";
import Column from "@c/Column";
import AddColumn from "@c/AddColumn";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect } from "react";

const Board = () => {
  const { columns, reorderColumns } = useKanbanStore();

  useEffect(() => {
    const unsubscribe = monitorForElements({
      onDrop: (e) => {
        const { type, index } = e.source.data;

        if (type === "column" && e.location.current.dropTargets.length) {
          const targetIndex = e.location.current.dropTargets[0].data?.index;
          if (targetIndex !== undefined && index !== targetIndex) {
            reorderColumns(Number(index), Number(targetIndex));
          }
        }
      },
    });

    return unsubscribe;
  }, [reorderColumns]);

  return (
    <div className="board">
      <div className="columns-container">
        {columns
          .sort((a, b) => a.order - b.order)
          .map((column, index) => (
            <Column key={column.id} column={column} index={index} />
          ))}
        <AddColumn />
      </div>
    </div>
  );
};
export default Board;
