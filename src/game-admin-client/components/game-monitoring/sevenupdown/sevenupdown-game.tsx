import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import { Constant, Resources } from "./sevenupdown-constants";
import { SevenUpDownGameModel } from "./sevenupdown-model";
import styles from "./sevenupdown.module.scss";

export default class SevenUpDownGame extends BaseMonitoring<
  SevenUpDownGameModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new SevenUpDownGameModel();
    const bodyElement = document.body;
    bodyElement.style.background = "none";

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  inGameHandler({ inGame }) {}

  get totalTimeInRound(): number {
    return Constant.totalTimeInRound;
  }

  get waitingTime(): number {
    return Constant.waitingTime;
  }

  findDuplicates(input_array: Array<string>) {
    const duplicates = input_array.filter(
      (item, index) => input_array.indexOf(item) !== index
    );
    return Array.from(new Set(duplicates));
  }

  handleSubmit() {
    const { dice1, dice2, multiplierValue, choice, roundNumber } = this.state;

    this.props.sendMessage({
      set_result: {
        roundId: roundNumber + 1,
        result: {
          dice1,
          dice2,
          multiplier:
            multiplierValue && choice
              ? { choice, value: multiplierValue }
              : undefined,
        },
      },
    });

    this.setState({
      isSubmited: true,
    });

    setTimeout(() => {
      this.setState({
        isSubmited: false,
      });
    }, Constant.showedSucceedMessegeTimebyMillisecond);
  }

  render() {
    if (this.props.isProduction) {
      return <>{Resources.unauthorized}</>;
    }

    const {
      isSubmited,
      gameState,
      dice1,
      dice2,
      roundNumber,
      multiplierValue,
      choice,
    } = this.state;

    return (
      <Container className={styles["cointoss"]}>
        <Row>
          <Col className={`${styles["bold"]}`}>
            {" "}
            <h2>{Resources.gameName}</h2>
          </Col>
        </Row>
        <Row>
          <Col className={`${styles["bold"]}`}>
            {Resources.nextRound} {roundNumber > 0 && `#${roundNumber}`}
          </Col>
        </Row>

        <Row className={``}>
          <Col className="col-1">
            {" "}
            <label>Dice 1</label>
          </Col>
          <Col className="col-2">
            <input
              className="form-control"
              name="dice1"
              type="number"
              value={dice1}
              onChange={(event) => {
                this.setState({ dice1: parseInt(event.target.value) });
              }}
            />
          </Col>
        </Row>
        <Row className={``}>
          <Col className="col-1">
            <label>Dice 2</label>
          </Col>
          <Col className="col-2">
            <input
              className="form-control"
              name="dice2"
              type="number"
              value={dice2}
              onChange={(event) => {
                this.setState({ dice2: parseInt(event.target.value) });
              }}
            />
          </Col>
        </Row>
        <Row className={``}>
          <Col className="col-1">
            <label>Multiplier</label>
          </Col>
          <Col className="col-2">
            <input
              className="form-control"
              name="multiplierValue"
              type="number"
              value={multiplierValue}
              onChange={(event) => {
                this.setState({
                  multiplierValue: parseFloat(event.target.value),
                });
              }}
            />
          </Col>
        </Row>
        <Row className={``}>
          <Col className="col-1">
            <label>Choice</label>
          </Col>
          <Col className="col-2">
            <select
              className="form-control"
              name="choice"
              value={choice}
              onChange={(event) => {
                this.setState({
                  choice: event.target.value,
                });
              }}
            >
              <option value=""></option>
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="seven">Seven</option>
            </select>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              disabled={gameState === GameState.waiting}
              onClick={this.handleSubmit}
              className={styles["custom-button"]}
            >
              {Resources.submit}
            </Button>
          </Col>
        </Row>
        {isSubmited && (
          <Row>
            <Col className="col-10">
              <div className={`${styles["success-message"]}  text-center`}>
                {Resources.updateSuccessful}
              </div>
            </Col>
          </Row>
        )}
        {gameState == GameState.disabled && (
          <Notice isOpen={true} message={Resources.disabledMessage} />
        )}
      </Container>
    );
  }
}
