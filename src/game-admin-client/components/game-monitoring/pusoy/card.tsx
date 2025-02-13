import React from "react";
import { useMemo } from "react";
import Styles from "./card.module.scss";

const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const SUITS = ["♠", "♥", "♣", "♦"];

export const Card = ({ id }: { id: number }) => {
  const data = useMemo(() => {
    const suit = SUITS[id % SUITS.length];
    return {
      rank: RANKS[Math.floor(id / SUITS.length)],
      suit: suit,
      color: suit === "♠" || suit === "♣" ? "black" : "red",
    };
  }, [id]);
  return (
    <div className={Styles.card} style={{ color: data.color }}>
      <div>{data.rank}</div>
      <div>{data.suit}</div>
    </div>
  );
};
