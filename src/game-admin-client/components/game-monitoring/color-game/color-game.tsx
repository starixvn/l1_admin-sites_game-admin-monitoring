import React from "react";
import { Col, Container, Modal, Row } from "reactstrap";

import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import {
  ColorGameBetList,
  ColorGameModel,
  ColorGameSettlementResult,
} from "../../common/model/ColorGameModel";
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

enum ColorGameDice {
  yellow = 0,
  red,
  pink,
  white,
  blue,
  green,
}

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

  getResult(dices) {
    const result = new Array<DiceModel>();

    result.push(new DiceModel(dices.dice1, DiceType.ColorGame));
    result.push(new DiceModel(dices.dice2, DiceType.ColorGame));
    result.push(new DiceModel(dices.dice3, DiceType.ColorGame));

    return result;
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
    const { betList, roundNumber, time, result, gameState, settlementResult } =
      this.state;

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
            <Row className="justify-content-center">
              <TotalBet
                total={betList.yellow.total}
                type="yellow"
                isWin={settlementResult.yellow}
              ></TotalBet>
              <TotalBet
                total={betList.red.total}
                type="red"
                isWin={settlementResult.red}
              ></TotalBet>
              <TotalBet
                total={betList.pink.total}
                type="pink"
                isWin={settlementResult.pink}
              ></TotalBet>
            </Row>
            <Row className="justify-content-center">
              <TotalBet
                total={betList.white.total}
                type="white"
                isWin={settlementResult.white}
              ></TotalBet>
              <TotalBet
                total={betList.blue.total}
                type="blue"
                isWin={settlementResult.blue}
              ></TotalBet>
              <TotalBet
                total={betList.green.total}
                type="green"
                isWin={settlementResult.green}
              ></TotalBet>
            </Row>
          </Col>
          <Col align="center" className="col-2">
            <Row className="justify-content-center">
              <TotalBet
                total={betList.hot.total}
                type="hot"
                isWin={settlementResult.hot}
              />
            </Row>
            <Row className="justify-content-center">
              <TotalBet
                total={betList.cold.total}
                type="cold"
                isWin={settlementResult.cold}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { betList, settlementResult } = this.state;

    return (
      <React.Fragment>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.yellow.dataList}
            titles={[this.renderBetListColor(ColorGameDice.yellow)]}
            isWin={settlementResult.yellow}
          />
        </Col>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.red.dataList}
            titles={[this.renderBetListColor(ColorGameDice.red)]}
            isWin={settlementResult.red}
          />
        </Col>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.pink.dataList}
            titles={[this.renderBetListColor(ColorGameDice.pink)]}
            isWin={settlementResult.pink}
          />
        </Col>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.white.dataList}
            titles={[this.renderBetListColor(ColorGameDice.white)]}
            isWin={settlementResult.white}
          />
        </Col>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.blue.dataList}
            titles={[this.renderBetListColor(ColorGameDice.blue)]}
            isWin={settlementResult.blue}
          />
        </Col>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.green.dataList}
            titles={[this.renderBetListColor(ColorGameDice.green)]}
            isWin={settlementResult.green}
          />
        </Col>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.hot.dataList}
            titles={[<div className="text-center">Hot</div>]}
            isWin={settlementResult.hot}
          />
        </Col>
        <Col className="col-4 col-lg">
          <BetList
            type="simple"
            dataList={betList.cold.dataList}
            titles={[<div className="text-center">Cold</div>]}
            isWin={settlementResult.cold}
          />
        </Col>
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
          <Dice
            diceModel={new DiceModel(0, DiceType.ColorGame)}
            isSmall={false}
            isColorGame={true}
            onClickHandle={this.handleChangeResult}
          />
          <Dice
            diceModel={new DiceModel(1, DiceType.ColorGame)}
            isSmall={false}
            isColorGame={true}
            onClickHandle={this.handleChangeResult}
          />
          <Dice
            diceModel={new DiceModel(2, DiceType.ColorGame)}
            isSmall={false}
            isColorGame={true}
            onClickHandle={this.handleChangeResult}
          />
          <Dice
            diceModel={new DiceModel(3, DiceType.ColorGame)}
            isSmall={false}
            isColorGame={true}
            onClickHandle={this.handleChangeResult}
          />
          <Dice
            diceModel={new DiceModel(4, DiceType.ColorGame)}
            isSmall={false}
            isColorGame={true}
            onClickHandle={this.handleChangeResult}
          />
          <Dice
            diceModel={new DiceModel(5, DiceType.ColorGame)}
            isSmall={false}
            isColorGame={true}
            onClickHandle={this.handleChangeResult}
          />
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
