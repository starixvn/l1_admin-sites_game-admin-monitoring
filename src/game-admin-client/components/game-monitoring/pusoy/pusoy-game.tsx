import React, { useEffect, useRef } from "react";
import { DeckData, SortableDeckRef, SortableHandCard } from "./sortable-deck";
import Style from "./pusoy-game.module.scss";
import { Button, Input } from "reactstrap";
import { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";

export const PusoyGame = (props: BaseMonitoringProps) => {
  const deckRef = useRef<SortableDeckRef>(null);
  const handleOnResetDeck = () => {
    const data: number[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        data.push(i + j * 4);
      }
    }
    deckRef.current?.setCards(data);
  };
  useEffect(() => {
    handleOnResetDeck();
  }, []);
  const handleOnCardChanges = (data: DeckData) => {
    console.log(data);
  };
  return (
    <div className={Style.container}>
      <div className={Style.form}>
        <div className={Style.player}>
          <div>Player:</div>
          <Input
            id="exampleSelect"
            name="select"
            type="select"
            style={{ width: "80px" }}
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Input>
        </div>
        <div>Round: </div>
        <Button color="primary" style={{ height: "40px", margin: "auto" }}>
          Submit
        </Button>
      </div>
      <Button onClick={handleOnResetDeck}>Reset</Button>
      <SortableHandCard
        handleOnCardChanges={handleOnCardChanges}
        ref={deckRef}
        initCards={[]}
      ></SortableHandCard>
    </div>
  );
};
