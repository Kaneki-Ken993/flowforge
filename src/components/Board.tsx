import React, { useEffect } from "react";
import { useKanbanStore } from "@/hooks/kanbanStore";
import Column from "@c/Column";
import AddColumn from "@c/AddColumn";
import {
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";


const Board: React.FC = () => {
  const { columns, reorderColumns } = useKanbanStore();

  useEffect(() => {
    const cleanup = dropTargetForElements({
      element: document.querySelector(".board-container") as HTMLElement,
      getData: () => ({
        type: "board",
      }),
      onDragEnter: ({ source }) => {
        if (source.data.type !== "column") return;
      },
      onDrop: ({ source, location }) => {
        if (source.data.type !== "column") return;

        const sourceIndex = source.data.index;
        const closestEdge = extractClosestEdge(location);

        if (closestEdge && typeof sourceIndex === "number") {
          let destinationIndex: number;

          // Map the edge to a destination index
          if (closestEdge === "left") {
            destinationIndex = Math.max(0, sourceIndex - 1);
          } else {
            destinationIndex = Math.min(columns.length - 1, sourceIndex + 1);
          }

          if (sourceIndex !== destinationIndex) {
            reorderColumns(sourceIndex, destinationIndex);
          }
        }
      },
    });

    return () => {
      cleanup();
    };
  }, [columns, reorderColumns]);

  return (
    <div className="h-full h-screen overflow-x-auto pt-36">
      <div className="p-4">
        <div className="board-container flex space-x-4">
          {columns
            .sort((a, b) => a.order - b.order)
            .map((column, index) => (
              <Column key={column.id} column={column} index={index} />
            ))}
          <AddColumn />
        </div>
      </div>
    </div>
  );
};

export default Board;
