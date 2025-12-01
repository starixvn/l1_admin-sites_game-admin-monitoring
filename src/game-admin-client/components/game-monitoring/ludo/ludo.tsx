import React from "react";
import { Button, Col, Container, Input, Row } from "reactstrap";
import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import GameTemplate from "../game-template/game-template";
import styles from "./ludo.module.scss";

export const Constant = {
  totalTimeInRound: 17,
  waitingTime: 3,
};

class LudoModel extends BaseMonitoringState {
  dice1: number;
  dice2: number;
  isSubmitted: boolean;

  constructor() {
    super();
    this.dice1 = 1;
    this.dice2 = 1;
    this.isSubmitted = false;
  }
}

export default class Ludo extends BaseMonitoring<
  LudoModel,
  BaseMonitoringProps
> {
  private submitTimeout?: NodeJS.Timeout;
  constructor(props) {
    super(props);

    this.state = new LudoModel();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get totalTimeInRound(): number {
    return Constant.totalTimeInRound;
  }

  get waitingTime(): number {
    return Constant.waitingTime;
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
    const { dice1, dice2, roundNumber } = this.state;
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
    }

    if (!this.validate()) {
      return;
    }

    this.props.sendMessage({
      set_result: {
        roundId: roundNumber,
        result: {
          dice: [dice1, dice2],
        },
      },
    });

    this.setState({ isSubmitted: true });

    this.submitTimeout = setTimeout(() => {
      this.setState({ isSubmitted: false });
    }, 2000);
  }

  render() {
    if (this.props.isProduction) {
      const gameTemplateProps = {
        renderBetList: this.renderBetList,
        renderMonitor: this.renderMonitor,
        onChangePartnerFilter: this.onChangePartnerFilter,
        onChangeSystemFilter: this.onChangeSystemFilter,
        enableFilter: false,
        disabled: this.state.gameState === GameState.disabled,
        partners: this.props.partners,
      };

      return (
        <div className={styles["ludo"]}>
          <GameTemplate {...gameTemplateProps} />
        </div>
      );
    }

    const { isSubmitted, gameState, dice1, dice2, roundNumber } = this.state;
    const isValid = this.validate();

    return (
      <Container className={styles["ludo"]}>
        <Row className="mb-3">
          <Col>
            <h2 className={styles["bold"]}>Ludo</h2>
            <p className={styles["subtitle"]}>
              Next Round {roundNumber > 0 && `#${roundNumber}`}
            </p>
          </Col>
        </Row>

        <Row className={`${styles["input"]}`}>
          <Row className={`${styles["input-row"]}`}>
            {" "}
            <Col xs="4" className={`${styles["label"]}`}>
              Dice 1
            </Col>
            <Col xs="8" className={styles["input-container"]}>
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
            <Col xs="4" className={`${styles["label"]}`}>
              Dice 2
            </Col>
            <Col xs="8" className={styles["input-container"]}>
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
        </Row>

        <Row className="text-center">
          <Col>
            <Button
              color="primary"
              disabled={
                gameState === GameState.disabled ||
                gameState === GameState.waiting ||
                !isValid
              }
              onClick={this.handleSubmit}
              className={styles["custom-button"]}
            >
              Set Result
            </Button>
          </Col>
        </Row>

        {isSubmitted && (
          <Row className="mt-4">
            <Col className="col-10 mx-auto">
              <div className={`${styles["success-message"]}`}>
                Result updated successfully!
              </div>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
