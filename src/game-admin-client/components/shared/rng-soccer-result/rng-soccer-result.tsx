import React from "react";
import styles from "./rng-soccer-result.module.scss";
import Card from "../card/card";
import CardResult from "../../common/model/CardResult";

export default function RngSoccerResult(props: {
  result: Array<CardResult>;
  onClickCard?: Function;
}) {
  const { result, onClickCard } = props;
  const card1 = result[0];
  const card2 = result[1];

  return (
    <div className={styles.rngsoccerresult}>
      <div className={styles.homeCol}>
        <div className={styles.home}>Home</div>
        <Card
          cardName={"home"}
          value={card1.rank}
          suit={card1.suit}
          onClickHandle={onClickCard ? onClickCard : null}
        />
      </div>

      <div className={styles.line}></div>

      <div className={styles.awayCol}>
        <div className={styles.away}>Away</div>
        <Card
          cardName={"away"}
          value={card2.rank}
          suit={card2.suit}
          onClickHandle={onClickCard ? onClickCard : null}
        />
      </div>
    </div>
  );
}
