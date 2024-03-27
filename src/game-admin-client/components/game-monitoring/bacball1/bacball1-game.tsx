import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import { BacBall1Constant, BacBall1Resources } from "./bacball1-constants";
import { BacBall1GameModel } from "./bacball1-model";
import styles from "./bacball1.module.scss";

export default class BacBall1Game extends BaseMonitoring<
  BacBall1GameModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new BacBall1GameModel();
    const bodyElement = document.body;
    bodyElement.style.background = "none";

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  inGameHandler({ inGame }) {}

  remainingTimeHandler({ remainingTime, roundId, result }) {
    this.setState({ nextDrawId: result[result.length - 1].drawId + 1 });
  }

  finishHandler({ finish }) {
    this.setState({ nextDrawId: finish.drawId + 1 });
  }

  get totalTimeInRound(): number {
    return BacBall1Constant.totalTimeInRound;
  }

  get waitingTime(): number {
    return BacBall1Constant.waitingTime;
  }

  findDuplicates(input_array: Array<string>) {
    const duplicates = input_array.filter(
      (item, index) => input_array.indexOf(item) !== index
    );
    return Array.from(new Set(duplicates));
  }

  handleSubmit() {
    const { player, banker, nextDrawId } = this.state;

    this.props.sendMessage({
      set_result: {
        roundId: nextDrawId,
        result: { player: +player, banker: +banker },
      },
    });

    this.setState({
      isSubmited: true,
    });

    setTimeout(() => {
      this.setState({
        isSubmited: false,
      });
    }, BacBall1Constant.showedSucceedMessegeTimebyMillisecond);
  }

  validateBall(ball: string) {
    return +ball >= 1 && +ball <= 30;
  }

  validate() {
    return (
      this.validateBall(this.state.player) &&
      this.validateBall(this.state.banker)
    );
  }

  render() {
    if (this.props.isProduction) {
      return <>{BacBall1Resources.unauthorized}</>;
    }

    const { roundNumber, isSubmited, gameState, player, banker, nextDrawId } =
      this.state;
    const isValid = this.validate();

    return (
      <Container className={styles["bacball"]}>
        <Row>
          <Col className={`${styles["bold"]}`}>
            {" "}
            <h2>{BacBall1Resources.gameName}</h2>
          </Col>
        </Row>
        <Row>
          <Col className={`${styles["bold"]}`}>
            {BacBall1Resources.nextRound} {nextDrawId > 0 && `#${nextDrawId}`}
          </Col>
        </Row>

        <Row className={``}>
          <Col className={`col-2 ${styles["bold"]} ${styles["red"]}`}>
            Player
          </Col>
          <Col className="col-4 ">
            <input
              type="text"
              value={player}
              onChange={(event) => {
                this.setState({ player: event.target.value });
              }}
            />
          </Col>
        </Row>
        <Row className={``}>
          <Col className={`col-2 ${styles["bold"]} ${styles["blue"]}`}>
            Banker
          </Col>
          <Col className="col-4 ">
            <input
              type="text"
              value={banker}
              onChange={(event) => {
                this.setState({ banker: event.target.value });
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Button
              color="primary"
              disabled={gameState === GameState.waiting || !isValid}
              onClick={this.handleSubmit}
              className={styles["custom-button"]}
            >
              {BacBall1Resources.submit}
            </Button>
          </Col>
        </Row>
        {isSubmited && (
          <Row>
            <Col className="col-10">
              <div className={`${styles["success-message"]}  text-center`}>
                {BacBall1Resources.updateSuccessful}
              </div>
            </Col>
          </Row>
        )}
        {gameState == GameState.disabled && (
          <Notice isOpen={true} message={BacBall1Resources.disabledMessage} />
        )}
      </Container>
    );
  }
}

