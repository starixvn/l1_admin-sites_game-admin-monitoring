import React, { useEffect, useRef } from "react";
import { DeckData, SortableDeckRef, SortableHandCard } from "./sortable-deck";
import Style from "./pusoy-game.module.scss";
import { Button, Col, Input, Row } from "reactstrap";
import { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";

export const PusoyGame = (props: BaseMonitoringProps) => {
  const [deck, setDeck] = React.useState<DeckData>({} as DeckData);
  const [playerName, setPlayerName] = React.useState("");
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
  const handleShowJsonDeck = () => {
    const hands = [deck.slot1, deck.slot2, deck.slot3, deck.slot4].map(
      (hand) => {
        return convertCards2Hand(hand);
      }
    );
    const data = JSON.stringify(hands);
    navigator.clipboard.writeText(data);
    alert(`Copy successfully: \n${data}`);
  };
  const handleImportDeck = () => {
    const data = prompt("Import deck");
    try {
      const cards = JSON.parse(data);
      deckRef.current?.setCards(
        cards.reduce(
          (
            arr: number[],
            item: { front: number[]; middle: number[]; back: number[] }
          ) => arr.concat([...item.front, ...item.middle, ...item.back]),
          []
        )
      );
      alert(`Import successfully`);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmit = () => {
    const hands = [deck.slot1, deck.slot2, deck.slot3, deck.slot4].map(
      (hand) => {
        return convertCards2Hand(hand);
      }
    );
    props.sendMessage({ set_result: { result: { playerName, hands } } });
  };
  useEffect(() => {
    handleOnResetDeck();
  }, []);
  const handleOnCardChanges = (data: DeckData) => {
    setDeck(data);
  };
  return (
    <div className={Style.container}>
      <div className={Style.form}>
        <Row className={Style["mh-3"]}>
          <Col sm={2} className={`${Style["center-content"]} `}>
            <div style={{ margin: "auto" }}>Name: </div>
          </Col>
          <Col sm={7}>
            <Input
              id="playerName"
              name="text"
              placeholder="Player Name"
              type="text"
              onChange={(e) => setPlayerName(e.target.value)}
              value={playerName}
            />
          </Col>
          <Col sm={3}>
            <Button
              color="primary"
              style={{ height: "40px", margin: "auto" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </div>
      <div className={Style["fn-buttons"]}>
        <Button onClick={handleOnResetDeck}>Reset Deck</Button>
        <Button color="info" onClick={handleShowJsonDeck}>
          Copy Deck
        </Button>
        <Button color="info" onClick={handleImportDeck}>
          Import Deck
        </Button>
      </div>
      <SortableHandCard
        handleOnCardChanges={handleOnCardChanges}
        ref={deckRef}
        initCards={[]}
      ></SortableHandCard>
    </div>
  );
};

const convertCards2Hand = (cards: number[]) => {
  const front = cards.slice(0, 3);
  const middle = cards.slice(3, 8);
  const back = cards.slice(8, 13);

  return { front, middle, back };
};
