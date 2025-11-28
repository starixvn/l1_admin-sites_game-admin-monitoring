import React from "react";
import { Button, Col, Container, Input, Row } from "reactstrap";
import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import DiceResult from "../../shared/dice-result/dice-result";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import GameTemplate from "../game-template/game-template";
import styles from "./ludo.module.scss";

class LudoModel extends BaseMonitoringState {
  dice1: number;
  dice2: number;
  nextRoundId: number;
  isSubmited: boolean;

  constructor() {
    super();
    this.dice1 = 1;
    this.dice2 = 1;
    this.nextRoundId = 0;
    this.isSubmited = false;
  }
}

export default class Ludo extends BaseMonitoring<
  LudoModel,
  BaseMonitoringProps
> {
  constructor(props) {
    super(props);

    this.state = new LudoModel();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  remainingTimeHandler({ remainingTime, roundId, result }) {
    super.remainingTimeHandler({ remainingTime, roundId, result });
    this.setState({ nextRoundId: roundId + 1 });
  }

  finishHandler({ finish }) {
    super.finishHandler({ finish });
    this.setState({ nextRoundId: finish.roundId + 1 });
  }

  get totalTimeInRound(): number {
    return 32;
  }

  get waitingTime(): number {
    return 5;
  }

  get defaultResult(): any {
    return [
      new DiceModel(-1, DiceType.TaiXiu),
      new DiceModel(-1, DiceType.TaiXiu),
    ];
  }

  get defaultBetList(): {} {
    return {};
  }

  validateDiceValue(value: number): boolean {
    return value >= 1 && value <= 6;
  }

  validate(): boolean {
    return (
      this.validateDiceValue(this.state.dice1) &&
      this.validateDiceValue(this.state.dice2)
    );
  }

  handleSubmit() {
    const { dice1, dice2, nextRoundId } = this.state;

    if (!this.validate()) {
      return;
    }

    this.props.sendMessage({
      set_result: {
        roundId: nextRoundId,
        result: {
          dice: [dice1, dice2],
        },
      },
    });

    this.setState({ isSubmited: true });

    setTimeout(() => {
      this.setState({ isSubmited: false });
    }, 2000);
  }

  renderMonitor() {
    const { time, roundNumber, gameState } = this.state;

    return (
      <Container>
        <Row>
          <Col align="center" className={styles["shared-result"]}>
            <div>
              <div className={styles["game-title"]}>Ludo</div>
              <TimeCounter
                remainingTime={time.remainingTime}
                gameState={gameState}
                key={gameState}
              />
              <RoundNum roundNumber={roundNumber} />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    return (
      <Container>
        <Row>
          <Col>No bet list available</Col>
        </Row>
      </Container>
    );
  }

  render() {
    if (this.props.isProduction) {
      const gameTemplateProps = {
        renderBetList: this.renderBetList,
        renderMonitor: this.renderMonitor,
        onChangePartnerFilter: this.onChangePartnerFilter,
        onChangeSystemFilter: this.onChangeSystemFilter,
        enableFilter: false,
        disabled: this.state.gameState == GameState.disabled,
        partners: this.props.partners,
      };

      return (
        <div className={styles["ludo"]}>
          <GameTemplate {...gameTemplateProps} />
        </div>
      );
    }

    const { isSubmited, gameState, dice1, dice2, nextRoundId } = this.state;
    const isValid = this.validate();

    return (
      <Container className={styles["ludo"]}>
        <Row className="mb-3">
          <Col>
            <h2 className={styles["bold"]}>Ludo</h2>
            <p className={styles["subtitle"]}>
              Next Round {nextRoundId > 0 && `#${nextRoundId}`}
            </p>
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]}`}>
            Dice 1
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="number"
              min="1"
              max="6"
              value={dice1}
              placeholder="1-6"
              onChange={(event) =>
                this.setState({ dice1: parseInt(event.target.value) || 1 })
              }
              className={`${
                !this.validateDiceValue(dice1) && styles["invalid"]
              }`}
            />
          </Col>
        </Row>

        <Row className={`${styles["input-row"]}`}>
          <Col xs="3" className={`${styles["label"]}`}>
            Dice 2
          </Col>
          <Col xs="4" className={styles["input-container"]}>
            <Input
              type="number"
              min="1"
              max="6"
              value={dice2}
              placeholder="1-6"
              onChange={(event) =>
                this.setState({ dice2: parseInt(event.target.value) || 1 })
              }
              className={`${
                !this.validateDiceValue(dice2) && styles["invalid"]
              }`}
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
              Set Result
            </Button>
          </Col>
        </Row>

        {isSubmited && (
          <Row className="mt-4">
            <Col className="col-10 mx-auto">
              <div className={`${styles["success-message"]}`}>
                Result updated successfully!
              </div>
            </Col>
          </Row>
        )}

        <Row className="mt-4">
          <Col>
            <GameTemplate
              renderBetList={this.renderBetList}
              renderMonitor={this.renderMonitor}
              onChangePartnerFilter={this.onChangePartnerFilter}
              onChangeSystemFilter={this.onChangeSystemFilter}
              enableFilter={false}
              disabled={this.state.gameState == GameState.disabled}
              partners={this.props.partners}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
