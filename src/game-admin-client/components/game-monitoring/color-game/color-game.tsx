import React from "react";
import { Col, Container, Modal, Row } from "reactstrap";

import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import {
  ColorGameBetList,
  ColorGameModel,
  ColorGameSettlementResult,
} from "./color-game-model";
import BaseMonitoring, { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";
import BetList from "../../shared/bet-list/bet-list";
import { GameState } from "../../shared/common/GameState";
import DiceResult from "../../shared/dice-result/dice-result";
import Dice from "../../shared/dice/dice";
import { Notice } from "../../shared/notice/notice";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import GameTemplate from "../game-template/game-template";
import styles from "./color-game.module.scss";

const colorRows = [["yellow", "red", "pink"], ["white", "blue", "green"]];
const inferableChoices = ["hot", "cold"];

export default class ColorGame extends BaseMonitoring<ColorGameModel, BaseMonitoringProps> {
  constructor(props) {
    super(props);

    this.state = new ColorGameModel();
    this.openModal = this.openModal.bind(this);
    this.handleChangeResult = this.handleChangeResult.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  get totalTimeInRound(): number {
    return 30;
  }

  get waitingTime(): number {
    return 13;
  }

  get defaultBetList(): {} {
    return new ColorGameBetList();
  }

  get defaultResult(): any {
    return [
      new DiceModel(-1, DiceType.ColorGame),
      new DiceModel(-1, DiceType.ColorGame),
      new DiceModel(-1, DiceType.ColorGame),
    ];
  }

  get defaultSettlementResult(): any {
    return new ColorGameSettlementResult();
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getResult(dices) {
    return [
      new DiceModel(dices.dice1, DiceType.ColorGame),
      new DiceModel(dices.dice2, DiceType.ColorGame),
      new DiceModel(dices.dice3, DiceType.ColorGame),
    ];;
  }

  handleChangeResult(id, value) {
    const { currentDiceNumber } = this.state;
    const gameResult = this.state.nextRoundResult;
    const newResult = this.state.result;

    gameResult[`dice${+currentDiceNumber + 1}`] = value;

    newResult[currentDiceNumber] = new DiceModel(value, DiceType.ColorGame);
    this.setState({
      result: newResult,
      isOpenModal: false,
    });

    if (this.state.gameState == GameState.waiting) {
      this.setState({
        isHandleNextRoundResult: true,
        nextRoundResult: gameResult,
      });
    }

    this.props.sendMessage({
      set_result: {
        result: gameResult,
        roundId:
          this.state.gameState == GameState.running
            ? this.state.roundNumber
            : this.state.roundNumber + 1,
      },
    });
  }

  openModal(id) {
    this.setState({
      isOpenModal: true,
      currentDiceNumber: id.split("-")[1],
    });
  }

  toggleModal() {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  renderMonitor() {
    const { betList, roundNumber, time, result, gameState, settlementResult } = this.state;

    return (
      <Container>
        <Row className={styles["align-middle"]}>
          <Col align="center" className="col-12 col-md-4">
            <Row className={styles["align-middle"]}>
              <Col className={styles.timecounter}>
                <div className={styles.title}>Color Game</div>
                <TimeCounter
                  remainingTime={time.remainingTime}
                  gameState={gameState}
                ></TimeCounter>
                <RoundNum roundNumber={roundNumber} />
              </Col>
              <Col className={styles.result}>
                <DiceResult dices={result} diceClickHandle={this.openModal} isColorGame={true} />
              </Col>
            </Row>
          </Col>
          <Col align="center" className="col-4">
            {
              colorRows.map((row, rowIndex) => {
                return <Row className="justify-content-center" key={rowIndex}>
                  {
                    row.map((color, index) => {
                      return <TotalBet
                        key={index}
                        total={betList[color].total}
                        type={color}
                        isWin={settlementResult[color]}
                      />
                    })
                  }
                </Row>
              })
            }
          </Col>
          <Col align="center" className="col-2">
            {
              inferableChoices.map((choice, rowIndex) => {
                return <Row className="justify-content-center" key={rowIndex}>
                  <TotalBet
                    total={betList[choice].total}
                    type={choice}
                    isWin={settlementResult[choice]}
                  />
                </Row>
              })
            }
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { betList, settlementResult } = this.state;

    return (
      <React.Fragment>
        {
          colorRows.flat().map((color, index) => {
            return <Col className="col-4 col-lg" key={index}>
              <BetList
                type="simple"
                dataList={betList[color].dataList}
                titles={[this.renderBetListColor(index)]}
                isWin={settlementResult[color]}
              />
            </Col>
          })
        }
        {
          inferableChoices.map((choice, rowIndex) => {
            return <Col className="col-4 col-lg" key={rowIndex}>
              <BetList
                type="simple"
                dataList={betList[choice].dataList}
                titles={[<div className="text-center">{this.capitalizeFirstLetter(choice)}</div>]}
                isWin={settlementResult[choice]}
              />
            </Col>
          })
        }
      </React.Fragment>
    );
  }

  renderBetListColor(diceValue) {
    const dice = new DiceModel(diceValue, DiceType.ColorGame);

    return <Dice diceModel={dice} isSmall={false} isColorGame={true}></Dice>;
  }

  renderGameControl() {
    const { isOpenModal } = this.state;

    return (
      <Modal
        isOpen={isOpenModal}
        toggle={this.toggleModal}
        className={styles["game-control-panel"]}
      >
        <Row>
          {
            colorRows.flat().map((color, index) => {
              return <Dice
                key={index}
                diceModel={new DiceModel(index, DiceType.ColorGame)}
                isSmall={false}
                isColorGame={true}
                onClickHandle={this.handleChangeResult}
              />
            })
          }
        </Row>
      </Modal>
    );
  }

  render() {
    return (
      <div className={styles["color-game"]}>
        {!this.props.isProduction && this.renderGameControl()}
        <GameTemplate
          renderBetList={this.renderBetList}
          renderMonitor={this.renderMonitor}
          enableFilter={true}
          onChangeSystemFilter={this.onChangeSystemFilter}
          onChangePartnerFilter={this.onChangePartnerFilter}
          disabled={this.state.gameState == GameState.disabled}
          partners={this.props.partners}
        />
        {this.state.gameState == GameState.disabled && (
          <Notice isOpen={true} message="Game is disabled." />
        )}
      </div>
    );
  }
}
