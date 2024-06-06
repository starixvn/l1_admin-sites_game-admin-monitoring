import { Button, Col, Container, Row } from "reactstrap";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import { Constant, Resources } from "./cointoss-constants";
import { CoinTossGameModel } from "./cointoss-model";
import styles from "./cointoss.module.scss";
import React from "react";

export default class CoinTossGame extends BaseMonitoring<
  CoinTossGameModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new CoinTossGameModel();
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
    const { selectedChoice, roundNumber } = this.state;

    this.props.sendMessage({
      set_result: {
        roundId: roundNumber,
        result: {
          head: selectedChoice === "head",
          tail: selectedChoice !== "head",
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

    const { isSubmited, gameState, selectedChoice, roundNumber } = this.state;

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
          <Col className="col-4 ">
            <input
              name="choice"
              type="radio"
              value={selectedChoice}
              checked={selectedChoice === "head"}
              onChange={(event) => {
                this.setState({ selectedChoice: "head" });
              }}
            />
            <span className={`col-2 ${styles["bold"]} ${styles["blue"]}`}>
              Biden
            </span>
          </Col>
        </Row>

        <Row className={``}>
          <Col className="col-4 ">
            <input
              name="choice"
              type="radio"
              value={selectedChoice}
              checked={selectedChoice === "tail"}
              onChange={(event) => {
                this.setState({ selectedChoice: "tail" });
              }}
            />
            <span className={`col-2 ${styles["bold"]} ${styles["red"]}`}>
              Trump
            </span>
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

