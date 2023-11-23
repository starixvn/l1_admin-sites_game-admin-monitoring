import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import configs from "../../../configs.json";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import {
  BandarQiuQiuConstant,
  BandarQiuQiuResources,
  Dominoes,
  defaultResult,
} from "./bandar-qiu-qiu-constants";
import { BandarQiuQiuGameModel } from "./bandar-qiu-qiu-model";
import styles from "./bandar-qiu-qiu.module.scss";

export default class BandarQiuQiuGame extends BaseMonitoring<
  BandarQiuQiuGameModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new BandarQiuQiuGameModel();
    const bodyElement = document.body;
    bodyElement.style.background = "none";

    this.handleChangeResult = this.handleChangeResult.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDefaultResult = this.setDefaultResult.bind(this);
    this.fillOutResult = this.fillOutResult.bind(this);
  }

  get totalTimeInRound(): number {
    return BandarQiuQiuConstant.totalTimeInRound;
  }

  get waitingTime(): number {
    return BandarQiuQiuConstant.waitingTime;
  }

  inGameHandler({ inGame }) {}

  findDuplicates(input_array: Array<string>) {
    const duplicates = input_array.filter(
      (item, index) => input_array.indexOf(item) !== index
    );
    return Array.from(new Set(duplicates));
  }

  handleChangeResult(event, index: number) {
    this.rebuildState(event.target.value.split(","), index);
  }

  rebuildState(values: string[], index: number) {
    const trimmedArray = values
      .map((item, index) => (index === 0 ? item : item.trim()))
      .filter((trimmedItem, index) => index !== 0 || trimmedItem.trim() !== "");

    const clonedHanks = [...this.state.hanks];
    clonedHanks[index].values = trimmedArray;

    let invalidDominoes = [];
    const flatHanks = clonedHanks.reduce((accumulatedArray, hank) => {
      hank.values.forEach((item) => {
        if (Dominoes.indexOf(item) === -1) {
          invalidDominoes.push(item);
        }
      });
      return accumulatedArray.concat(hank.values);
    }, []);

    const duplicates = this.findDuplicates(flatHanks);

    clonedHanks.forEach((hank) => {
      hank.duplicatedItems = this.findDuplicates(
        hank.values.concat(duplicates)
      );
    });

    this.setState({
      hanks: clonedHanks,
      flatHanks: flatHanks,
      duplicatedItems: duplicates,
      isValidResult: clonedHanks.every((hank) => hank.isValid()),
    });
  }

  pickRandomItem(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  fillOutResult() {
    let copiedDominoes = [...Dominoes];

    this.state.flatHanks.forEach((hank) => {
      const indexToRemove = copiedDominoes.indexOf(hank);
      copiedDominoes.splice(indexToRemove, 1);
    });

    const clonedHanks = [...this.state.hanks];
    clonedHanks.forEach((hank) => {
      const length = hank.validedDominoes.length;
      if (length < 4) {
        for (let i = 0; i < 4 - length; i++) {
          const randomItem = this.pickRandomItem(copiedDominoes);
          hank.values.push(randomItem);
          const indexToRemove = copiedDominoes.indexOf(randomItem);
          copiedDominoes.splice(indexToRemove, 1);
        }
      }
    });

    clonedHanks.forEach((hank, index) => {
      this.rebuildState(hank.values, index);
    });
  }

  setDefaultResult() {
    defaultResult.forEach((hank, index) => {
      this.rebuildState(hank.values, index);
    });
  }

  handleSubmit() {
    const { roundNumber, flatHanks } = this.state;
    this.props.sendMessage({
      set_result: {
        roundId: roundNumber + 1,
        result: flatHanks,
      },
    });

    this.setState({
      isSubmited: true,
    });

    setTimeout(() => {
      this.setState({
        isSubmited: false,
      });
    }, BandarQiuQiuConstant.showedSucceedMessegeTimebyMillisecond);
  }

  render() {
    if (this.props.isProduction) {
      return <>{BandarQiuQiuResources.unauthorized}</>;
    }

    const {
      roundNumber,
      duplicatedItems,
      hanks,
      isValidResult,
      isSubmited,
      gameState,
    } = this.state;

    return (
      <Container className={styles["bandar-qiu-qiu"]}>
        <Row>
          <Col className={`${styles["bold"]}`}>
            {" "}
            <h2>{BandarQiuQiuResources.gameName}</h2>
          </Col>
        </Row>
        <Row>
          <Col className={`${styles["bold"]}`}>
            {BandarQiuQiuResources.nextRound}{" "}
            {roundNumber > 0 && `#${roundNumber + 1}`}
          </Col>
        </Row>
        {hanks.map((hank, index) => {
          return (
            <Row
              className={`col-12 ${hank.isValid() ? "" : styles["invalid"]}`}
              key={index}
            >
              <Col className={`col-2 ${styles["bold"]}`}>{hank.name}</Col>
              <Col className="col-4 ">
                <input
                  type="text"
                  value={hank.values.join(",")}
                  onChange={(event) => {
                    this.handleChangeResult(event, index);
                  }}
                />
              </Col>
              <Col className="col-6 ">
                {hank.values.map((value, index) => {
                  if (Dominoes.includes(value)) {
                    return (
                      <img
                        className={`${
                          duplicatedItems.includes(value)
                            ? styles["duplicated"]
                            : ""
                        }`}
                        key={index}
                        src={`${configs.RootUrl}/game-admin/images/bandar-qiu-qiu/${value}.png`}
                        width={50}
                        height={50}
                      ></img>
                    );
                  }

                  return <span key={index}></span>;
                })}
              </Col>
            </Row>
          );
        })}
        {/* <Row>
          <Col>
            <Button
              color="primary"
              onClick={this.setDefaultResult}
              className={styles["custom-button"]}
            >
              {BandarQiuQiuResources.setDefaultResult}
            </Button>
          </Col>

        </Row> */}
        <Row>
          <Col>
            <Button
              color="primary"
              onClick={this.fillOutResult}
              className={styles["custom-button"]}
            >
              {BandarQiuQiuResources.fillOutResult}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              disabled={gameState === GameState.waiting || !isValidResult}
              onClick={this.handleSubmit}
              className={styles["custom-button"]}
            >
              {BandarQiuQiuResources.submit}
            </Button>
          </Col>
        </Row>
        {isSubmited && (
          <Row>
            <Col className="col-10">
              <div className={`${styles["success-message"]}  text-center`}>
                {BandarQiuQiuResources.updateSuccessful}
              </div>
            </Col>
          </Row>
        )}
        {gameState == GameState.disabled && (
          <Notice
            isOpen={true}
            message={BandarQiuQiuResources.disabledMessage}
          />
        )}
      </Container>
    );
  }
}
