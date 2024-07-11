import React from "react";
import { DraggableCard } from "./draggable-card";

export const SegmentCard = ({ cards }: { cards: string[] }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {cards.map((id) => (
        <DraggableCard key={id} id={id} />
      ))}
    </div>
  );
};
