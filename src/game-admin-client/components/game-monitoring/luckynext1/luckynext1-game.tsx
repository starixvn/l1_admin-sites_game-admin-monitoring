import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import { LuckyNext1Constant, LuckyNext1Resources } from "./luckynext-constants";
import { LuckyNextGameModel } from "./luckynext-model";
import styles from "./luckynext.module.scss";

export default class LuckyNext1Game extends BaseMonitoring<
  LuckyNextGameModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new LuckyNextGameModel();
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
    return LuckyNext1Constant.totalTimeInRound;
  }

  get waitingTime(): number {
    return LuckyNext1Constant.waitingTime;
  }

  findDuplicates(input_array: Array<string>) {
    const duplicates = input_array.filter(
      (item, index) => input_array.indexOf(item) !== index
    );
    return Array.from(new Set(duplicates));
  }

  handleSubmit() {
    const { ball } = this.state;

    this.props.sendMessage({
      set_result: {
        result: { ball: +ball },
      },
    });

    this.setState({
      isSubmited: true,
    });

    setTimeout(() => {
      this.setState({
        isSubmited: false,
      });
    }, LuckyNext1Constant.showedSucceedMessegeTimebyMillisecond);
  }

  validateBall(ball: string) {
    return +ball >= 1 && +ball <= 75;
  }

  validate() {
    return this.validateBall(this.state.ball);
  }
  renderGameName() {
    return (
      <Row>
        <Col className={`${styles["bold"]}`}>
          <h2>{LuckyNext1Resources.gameName}</h2>
        </Col>
      </Row>
    );
  }

  render() {
    if (this.props.isProduction) {
      return <>{LuckyNext1Resources.unauthorized}</>;
    }

    const { isSubmited, gameState, ball, nextDrawId } = this.state;
    const isValid = this.validate();

    return (
      <Container className={styles["nextball"]}>
        {this.renderGameName()}
        <Row>
          <Col className={`${styles["bold"]}`}>
            {LuckyNext1Resources.nextRound} {nextDrawId > 0 && `#${nextDrawId}`}
          </Col>
        </Row>
        <Row className={``}>
          <Col className={`col-2 ${styles["bold"]} ${styles["red"]}`}>Ball</Col>
          <Col className="col-4 ">
            <input
              type="text"
              value={ball}
              onChange={(event) => {
                this.setState({ ball: event.target.value });
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
              {LuckyNext1Resources.submit}
            </Button>
          </Col>
        </Row>
        {isSubmited && (
          <Row>
            <Col className="col-10">
              <div className={`${styles["success-message"]}  text-center`}>
                {LuckyNext1Resources.updateSuccessful}
              </div>
            </Col>
          </Row>
        )}
        {gameState == GameState.disabled && (
          <Notice isOpen={true} message={LuckyNext1Resources.disabledMessage} />
        )}
      </Container>
    );
  }
}

