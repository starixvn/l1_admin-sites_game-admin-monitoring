import { useSortable } from "@dnd-kit/sortable";
import React, { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "./card";

export const DraggableCard = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, animateLayoutChanges: () => false });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardId = useMemo(() => id.split(":")[1], [id]);
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card id={cardId} />
    </div>
  );
};
