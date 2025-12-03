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
import { LudoBoard } from "./ludo-board";
import { PlayerColor } from "./enums";
import { GameContextProvider, GameStore } from "./GameContext";
import { convertBoard } from "./helper";

export const Constant = {
  totalTimeInRound: 17,
  waitingTime: 3,
};

const PLAYER_LABELS = {
  [PlayerColor.ZERO]: "Yellow",
  [PlayerColor.ONE]: "Blue",
  [PlayerColor.TWO]: "Red",
  [PlayerColor.THREE]: "Green",
};

class LudoModel extends BaseMonitoringState {
  dice1: number;
  dice2: number;
  currentBoard: { [player in string]: number[] };
  boardInput: { [player in string]: number[] };
  isSubmitted: boolean;

  constructor() {
    super();
    this.currentBoard = {
      [PlayerColor.ZERO]: [0, 0, 0, 0],
      [PlayerColor.ONE]: [0, 0, 0, 0],
      [PlayerColor.TWO]: [0, 0, 0, 0],
      [PlayerColor.THREE]: [0, 0, 0, 0],
    };
    this.dice1 = 1;
    this.dice2 = 1;
    // Board setting initial state
    this.boardInput = {
      [PlayerColor.ZERO]: [0, 0, 0, 0],
      [PlayerColor.ONE]: [0, 0, 0, 0],
      [PlayerColor.TWO]: [0, 0, 0, 0],
      [PlayerColor.THREE]: [0, 0, 0, 0],
    };
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
    this.handleBoardInputChange = this.handleBoardInputChange.bind(this);
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
    const { dice1, dice2, roundNumber, boardInput } = this.state;
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
    }

    if (!this.validate() || !this.validateBoard()) {
      return;
    }

    this.props.sendMessage({
      set_result: {
        roundId: roundNumber,
        result: {
          dice: [dice1, dice2],
          currentBoardState: boardInput,
        },
      },
    });

    this.setState({ isSubmitted: true });

    this.submitTimeout = setTimeout(() => {
      this.setState({ isSubmitted: false });
    }, 2000);
  }

  // Board setting methods
  validatePosition(value: number): boolean {
    return value >= 0 && value <= 62;
  }

  validateBoard(): boolean {
    const { boardInput } = this.state;
    for (const player in boardInput) {
      for (const position of boardInput[player]) {
        if (!this.validatePosition(position)) {
          return false;
        }
      }
    }
    return true;
  }

  handleBoardInputChange(
    player: PlayerColor,
    horseIndex: number,
    value: number
  ) {
    this.setState((prevState) => {
      const newBoardInput = { ...prevState.boardInput };
      newBoardInput[player] = [...newBoardInput[player]];
      newBoardInput[player][horseIndex] = value;
      return { boardInput: newBoardInput };
    });
  }

  getPreviewGameStore(): GameStore | undefined {
    const { boardInput } = this.state;
    const turnResult = convertBoard(boardInput);
    return { turnResult };
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

    const { isSubmitted, gameState, dice1, dice2, roundNumber, boardInput } =
      this.state;
    const isValid = this.validate();
    const isBoardValid = this.validateBoard();
    const previewGameStore = this.getPreviewGameStore();

    return (
      <Container className={styles["ludo"]}>
        <Row className="mb-2">
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
                  !this.validateDiceValue(dice1) ? styles["invalid"] : ""
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
                  !this.validateDiceValue(dice2) ? styles["invalid"] : ""
                }`}
              />
            </Col>
          </Row>
        </Row>

        <hr />

        <Row className="mb-2">
          <Col>
            <p className={styles["subtitle"]}>
              Position: 0 = Starting Area, 1-56 = Race Track, 57-62 = Stable
            </p>
          </Col>
        </Row>

        <div className={`${styles["board-inputs"]}`}>
          {Object.values(PlayerColor)
            .filter((v) => typeof v === "number")
            .map((player) => (
              <div key={player} className={`${styles["board-input"]}`}>
                <div className={`${styles["label"]}`}>
                  {PLAYER_LABELS[player as PlayerColor]} Player
                </div>
                <div className={`${styles["input-container"]}`}>
                  {[0, 1, 2, 3].map((horseIndex) => (
                    <div className={`${styles["input-item"]}`} key={horseIndex}>
                      <Input
                        type="number"
                        min="0"
                        max="62"
                        value={boardInput[player as PlayerColor][horseIndex]}
                        placeholder="0-62"
                        onChange={(event) =>
                          this.handleBoardInputChange(
                            player as PlayerColor,
                            horseIndex,
                            parseInt(event.target.value) || 0
                          )
                        }
                        className={`${
                          !this.validatePosition(
                            boardInput[player as PlayerColor][horseIndex]
                          )
                            ? styles["invalid"]
                            : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        <GameContextProvider gameStore={previewGameStore}>
          <LudoBoard />
        </GameContextProvider>

        <Row className="text-center mb-3">
          <Col>
            <Button
              color="primary"
              disabled={
                gameState === GameState.disabled ||
                gameState === GameState.waiting ||
                !isValid ||
                !isBoardValid
              }
              onClick={this.handleSubmit}
              className={styles["custom-button"]}
            >
              Set Result
            </Button>
          </Col>
        </Row>

        {isSubmitted && (
          <Row className="mb-3">
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

