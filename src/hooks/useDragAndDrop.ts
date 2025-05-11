import {
  draggable,
  DroppableEntry,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, RefObject } from "react";
import { useKanbanStore } from "@h/kanbanStore";
import type { DroppableProps } from "@/types";

export function useDraggable(
  ref: RefObject<HTMLElement | null>,
  { data, onDragStart, onDrop }: DroppableProps
) {
  useEffect(() => {
    if (!ref.current) return;
    return draggable({
      element: ref.current,
      data,
      onDragStart,
      onDrop,
    });
  }, [ref, data, onDragStart, onDrop]);
}

export function useDroppable(
  ref: RefObject<HTMLElement>,
  { onDragEnter, onDragLeave, onDrop }: DroppableProps
) {
  useEffect(() => {
    if (!ref.current) return;
    return dropTargetForElements({
      element: ref.current,
      onDragEnter,
      onDragLeave,
      onDrop,
    });
  }, [ref, onDragEnter, onDragLeave, onDrop]);
}

export function useTaskDragAndDrop(taskId: string, columnId: string) {
  const ref = useRef<HTMLElement>(null);
  const { moveTask } = useKanbanStore();

  useDraggable(ref, {
    data: { taskId, columnId, type: "task" as const },
    onDragStart: () => {},
    onDrop: () => {},
  });

  return ref;
}

export function useColumnDragAndDrop(columnId: string, index: number) {
  const ref = useRef<HTMLElement>(null);
  const { reorderColumns } = useKanbanStore();

  useDraggable(ref, {
    data: { columnId, index, type: "column" as const },
    onDragStart: () => {},
    onDrop: () => {},
  });

  return ref;
}
