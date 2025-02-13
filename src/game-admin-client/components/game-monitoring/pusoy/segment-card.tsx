import React from "react";
import { DraggableCard } from "./draggable-card";
import Styles from "./segment-card.module.scss";

export const SegmentCard = ({ cards }: { cards: string[] }) => {
  return (
    <div className={Styles["segment"]}>
      {cards.map((id, index) => (
        <>
          <DraggableCard key={id} id={id} />
          {(index === 2 || index === 7) && (
            <div className={Styles["vertical-line"]}></div>
          )}
        </>
      ))}
    </div>
  );
};
