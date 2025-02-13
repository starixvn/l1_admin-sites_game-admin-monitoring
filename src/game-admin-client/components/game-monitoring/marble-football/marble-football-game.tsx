import React from "react";
import { Button, Col, Container, Row, Input, Label } from "reactstrap";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import {
  MarbleFootballConstant,
  MarbleFootballResources,
} from "./marble-football-constants";
import { MarbleFootballGameModel } from "./marble-football-model";
import styles from "./marble-football.module.scss";

export default class MarbleFootballGame extends BaseMonitoring<
  MarbleFootballGameModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new MarbleFootballGameModel();
    document.body.style.background = "none";
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  inGameHandler({ inGame }) {}

  remainingTimeHandler({ remainingTime, roundId, result }) {
    this.setState({ nextRoundId: roundId + 1 });
  }

  finishHandler({ finish }) {
    this.setState({ nextRoundId: finish.roundId + 1 });
  }

  get totalTimeInRound(): number {
    return MarbleFootballConstant.totalTimeInRound;
  }

  get waitingTime(): number {
    return MarbleFootballConstant.waitingTime;
  }

  findDuplicates(input_array: Array<string>) {
    const duplicates = input_array.filter(
      (item, index) => input_array.indexOf(item) !== index
    );
    return Array.from(new Set(duplicates));
  }

  handleSubmit() {
    const { firstHalf, secondHalf, nextRoundId, homeWinsOnDraw } = this.state;

    this.props.sendMessage({
      set_result: {
        roundId: nextRoundId,
        result: {
          firstHalf,
          secondHalf,
          homeWinsOnDraw,
        },
      },
    });

    this.setState({ isSubmited: true });

    setTimeout(() => {
      this.setState({ isSubmited: false });
    }, MarbleFootballConstant.showedSucceedMessegeTimebyMillisecond);
  }

  validateHalfResult(firstHalf: string) {
    return /^[HA]{0,4}$/.test(firstHalf);
  }

  validate() {
    return (
      this.validateHalfResult(this.state.firstHalf) &&
      this.validateHalfResult(this.state.secondHalf)
    );
  }

  render() {
    if (this.props.isProduction) {
      return <>{MarbleFootballResources.unauthorized}</>;
    }

    const {
      isSubmited,
      gameState,
      firstHalf,
      secondHalf,
      nextRoundId,
      homeWinsOnDraw,
    } = this.state;
    const isValid = this.validate();

    return (
      <Container className={styles["marble-football"]}>
        <Row className="mb-3">
          <Col>
            <h2 className={styles["bold"]}>
              {MarbleFootballResources.gameName}
            </h2>
            <p className={styles["subtitle"]}>
              {MarbleFootballResources.nextRound}{" "}
              {nextRoundId > 0 && `#${nextRoundId}`}
            </p>
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]} ${styles["red"]}`}>
            First Half
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="text"
              value={firstHalf}
              placeholder="AH"
              onChange={(event) =>
                this.setState({ firstHalf: event.target.value })
              }
              className={`${
                !this.validateHalfResult(firstHalf) && styles["invalid"]
              }`}
            />
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]} ${styles["blue"]}`}>
            Second Half
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="text"
              value={secondHalf}
              placeholder="HA"
              onChange={(event) =>
                this.setState({ secondHalf: event.target.value })
              }
              className={`${
                !this.validateHalfResult(secondHalf) && styles["invalid"]
              }`}
            />
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]} ${styles["black"]}`}>
            Home Win On Draw
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="checkbox"
              checked={homeWinsOnDraw}
              onChange={(event) =>
                this.setState({ homeWinsOnDraw: event.target.checked })
              }
              className={styles["large-checkbox"]}
            />
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
            <Button
              color="primary"
              disabled={gameState === GameState.waiting || !isValid}
              onClick={this.handleSubmit}
              className={styles["custom-button"]}
            >
              {MarbleFootballResources.submit}
            </Button>
          </Col>
        </Row>

        {isSubmited && (
          <Row className="mt-4">
            <Col className="col-10 mx-auto">
              <div className={`${styles["success-message"]}`}>
                {MarbleFootballResources.updateSuccessful}
              </div>
            </Col>
          </Row>
        )}

        {gameState === GameState.disabled && (
          <Notice
            isOpen={true}
            message={MarbleFootballResources.disabledMessage}
          />
        )}
      </Container>
    );
  }
}

