import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import { SeBallConstant, SeBallResources } from "./seball-constants";
import { SeBallGameModel } from "./seball-model";
import styles from "../luckynext1/luckynext.module.scss";

export default class SeBallGame extends BaseMonitoring<
  SeBallGameModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new SeBallGameModel();
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
    return SeBallConstant.totalTimeInRound;
  }

  get waitingTime(): number {
    return SeBallConstant.waitingTime;
  }

  findDuplicates(input_array: Array<string>) {
    const duplicates = input_array.filter(
      (item, index) => input_array.indexOf(item) !== index
    );
    return Array.from(new Set(duplicates));
  }

  handleSubmit() {
    const { balls } = this.state;
    const listBalls = balls.split(",").map((ball) => +ball);

    this.props.sendMessage({
      set_result: {
        result: { balls: listBalls },
      },
    });

    this.setState({
      isSubmited: true,
    });

    setTimeout(() => {
      this.setState({
        isSubmited: false,
      });
    }, SeBallConstant.showedSucceedMessegeTimebyMillisecond);
  }

  validateBall(balls: string) {
    const listBalls = balls.split(",");
    return (
      listBalls.length === 4 &&
      listBalls.every((ball) => +ball >= 1 && +ball <= 60)
    );
  }

  validate() {
    return this.validateBall(this.state.balls);
  }
  renderGameName() {
    return (
      <Row>
        <Col className={`${styles["bold"]}`}>
          <h2>{SeBallResources.gameName}</h2>
        </Col>
      </Row>
    );
  }

  render() {
    if (this.props.isProduction) {
      return <>{SeBallResources.unauthorized}</>;
    }

    const { isSubmited, gameState, balls, nextDrawId } = this.state;
    const isValid = this.validate();

    return (
      <Container className={styles["nextball"]}>
        {this.renderGameName()}
        <Row>
          <Col className={`${styles["bold"]}`}>
            {SeBallResources.nextRound} {nextDrawId > 0 && `#${nextDrawId}`}
          </Col>
        </Row>
        <Row className={``}>
          <Col className={`col-2 ${styles["bold"]} ${styles["red"]}`}>
            Balls
          </Col>
          <Col className="col-4 ">
            <input
              type="text"
              value={balls}
              onChange={(event) => {
                this.setState({ balls: event.target.value });
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
              {SeBallResources.submit}
            </Button>
          </Col>
        </Row>
        {isSubmited && (
          <Row>
            <Col className="col-10">
              <div className={`${styles["success-message"]}  text-center`}>
                {SeBallResources.updateSuccessful}
              </div>
            </Col>
          </Row>
        )}
        {gameState == GameState.disabled && (
          <Notice isOpen={true} message={SeBallResources.disabledMessage} />
        )}
      </Container>
    );
  }
}
