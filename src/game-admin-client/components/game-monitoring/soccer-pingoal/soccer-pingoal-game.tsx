import React from "react";
import { Button, Col, Container, Row, Input } from "reactstrap";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import {
  SoccerPinGoalConstant,
  SoccerPinGoalResources,
} from "./soccer-pingoal-constants";
import { SoccerPinGoalGameModel } from "./soccer-pingoal-model";
import styles from "./soccer-pingoal.module.scss";

export default class SoccerPinGoalGame extends BaseMonitoring<
  SoccerPinGoalGameModel,
  BaseMonitoringProps
> {
  constant: typeof SoccerPinGoalConstant;
  resources: typeof SoccerPinGoalResources;

  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new SoccerPinGoalGameModel();
    document.body.style.background = "none";
    this.handleSubmit = this.handleSubmit.bind(this);
    this.constant = SoccerPinGoalConstant;
    this.resources = SoccerPinGoalResources;
  }

  inGameHandler({ inGame }) {}

  remainingTimeHandler({ remainingTime, roundId, result }) {
    this.setState({ nextRoundId: roundId + 1 });
  }

  finishHandler({ finish }) {
    this.setState({ nextRoundId: finish.roundId + 1 });
  }

  findDuplicates(input_array: Array<string>) {
    const duplicates = input_array.filter(
      (item, index) => input_array.indexOf(item) !== index
    );
    return Array.from(new Set(duplicates));
  }

  handleSubmit() {
    const { red, blue, nextRoundId, playerName } = this.state;

    this.props.sendMessage({
      set_result: {
        roundId: nextRoundId,
        result: {
          red,
          blue,
          playerName,
        },
      },
    });

    this.setState({ isSubmited: true });

    setTimeout(() => {
      this.setState({ isSubmited: false });
    }, this.constant.showedSucceedMessegeTimebyMillisecond);
  }

  validateResult(value: number) {
    return value >= this.constant.minValue && value <= this.constant.maxValue;
  }

  validate() {
    return (
      this.validateResult(this.state.red) &&
      this.validateResult(this.state.blue)
    );
  }

  render() {
    if (this.props.isProduction) {
      return <>{this.resources.unauthorized}</>;
    }

    const { isSubmited, gameState, red, blue, nextRoundId, playerName } =
      this.state;
    const isValid = this.validate();

    return (
      <Container className={styles["soccer-pingoal"]}>
        <Row className="mb-3">
          <Col>
            <h2 className={styles["bold"]}>{this.resources.gameName}</h2>
            <p className={styles["subtitle"]}>
              {this.resources.nextRound} {nextRoundId > 0 && `#${nextRoundId}`}
            </p>
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]} ${styles["black"]}`}>
            Player Name
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="text"
              value={playerName}
              placeholder="TestPlayer"
              onChange={(event) =>
                this.setState({ playerName: event.target.value })
              }
            />
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]} ${styles["red"]}`}>
            Red
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="number"
              value={red}
              placeholder="0"
              onChange={(event) =>
                this.setState({ red: parseInt(event.target.value) })
              }
              className={`${!this.validateResult(red) && styles["invalid"]}`}
            />
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]} ${styles["blue"]}`}>
            Blue
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="number"
              value={blue}
              placeholder="0"
              onChange={(event) =>
                this.setState({ blue: parseInt(event.target.value) })
              }
              className={`${!this.validateResult(blue) && styles["invalid"]}`}
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
              {this.resources.submit}
            </Button>
          </Col>
        </Row>

        {isSubmited && (
          <Row className="mt-4">
            <Col className="col-10 mx-auto">
              <div className={`${styles["success-message"]}`}>
                {this.resources.updateSuccessful}
              </div>
            </Col>
          </Row>
        )}

        {gameState === GameState.disabled && (
          <Notice isOpen={true} message={this.resources.disabledMessage} />
        )}
      </Container>
    );
  }
}
