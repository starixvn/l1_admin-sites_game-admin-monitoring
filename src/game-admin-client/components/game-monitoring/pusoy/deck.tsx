import React, { useMemo } from "react";
import { SegmentCard } from "./segment-card";
import Styles from "./deck.module.scss";

export const Deck = ({ cards }: { cards: string[] }) => {
  const segments = useMemo(() => {
    const segmentSize = cards.length / 4;
    return [
      cards.slice(0, segmentSize),
      cards.slice(segmentSize, segmentSize * 2),
      cards.slice(segmentSize * 2, segmentSize * 3),
      cards.slice(segmentSize * 3, segmentSize * 4),
    ];
  }, [cards]);

  return (
    <div className={Styles.deck}>
      <SegmentCard cards={segments[0]} />
      <hr />
      <SegmentCard cards={segments[1]} />
      <hr />
      <SegmentCard cards={segments[2]} />
      <hr />
      <SegmentCard cards={segments[3]} />
    </div>
  );
};
