import _ from "lodash";
import React from "react";
import { Col, Container, Modal, Row } from "reactstrap";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import SeDie3Model, {
  SeDie3BetList,
  SeDie3SettlementResult,
} from "../../common/model/Sedie3Model";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import BetList from "../../shared/bet-list/bet-list";
import Dice from "../../shared/dice/dice";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import styles from "./sedie3.module.scss";

const DefaultResult = [
  new DiceModel(-1, DiceType.XocXoc),
  new DiceModel(-1, DiceType.XocXoc),
  new DiceModel(-1, DiceType.XocXoc),
];

const DefaultSettlementResult = new SeDie3SettlementResult();
const DefaultBetList = new SeDie3BetList();

export default class SeDie3 extends BaseMonitoring<
  SeDie3Model,
  BaseMonitoringProps
> {
  constructor(props) {
    super(props);

    this.state = new SeDie3Model();
  }

  get defaultResult() {
    return DefaultResult;
  }

  get defaultSettlementResult() {
    return DefaultSettlementResult;
  }

  get totalTimeInRound(): number {
    return 30;
  }

  get waitingTime(): number {
    return 10;
  }

  get defaultBetList(): {} {
    return DefaultBetList;
  }

  getResult(data) {
    const result = new Array<DiceModel>();
    Object.keys(data).forEach((key) => {
      result.push(new DiceModel(data[key] ? 1 : 0, DiceType.XocXoc));
    });

    return result;
  }

  openModal(diceIndex) {
    this.setState({
      isOpenControlResultModal: true,
      currentDiceNumber: diceIndex,
    });
  }

  handleChangeResult(id, value) {
    const { currentDiceNumber, result } = this.state;
    const gameResult = this.state.nextRoundResult;

    const newResult = result.map((diceInfo, index) => {
      if (index === currentDiceNumber || diceInfo.value === -1) {
        diceInfo.value = value;
      }

      gameResult[`red${index + 1}`] = !!diceInfo.value;
      return diceInfo;
    });

    this.setState({
      result: newResult,
      isOpenControlResultModal: false,
      nextRoundResult: gameResult,
    });

    this.props.sendMessage({
      set_result: {
        result: gameResult,
        roundId: this.state.roundNumber + 1,
      },
    });
  }

  finishHandler({ finish }) {
    super.finishHandler({ finish });
    setTimeout(() => {
      const nextRoundResult = this.state.nextRoundResult;
      let result = this.defaultResult;
      if (!_.isEmpty(nextRoundResult)) {
        result = Object.values(nextRoundResult).map(
          (dice) => new DiceModel(+dice, DiceType.XocXoc)
        );
      }
      this.setState({
        result,
        nextRoundResult: {},
      });
    }, this.waitingTime * 1000);
  }

  renderGameControl() {
    const { isOpenControlResultModal } = this.state;

    return (
      <Modal
        isOpen={isOpenControlResultModal}
        toggle={() => this.toggleModal()}
        className={styles["game-control-panel"]}
      >
        <Row>
          <Dice
            key={`dice-select-${0}`}
            diceModel={new DiceModel(0, DiceType.XocXoc)}
            isSmall={false}
            onClickHandle={(id: string, value: number) =>
              this.handleChangeResult(id, value)
            }
          />
          <Dice
            key={`dice-select-${1}`}
            diceModel={new DiceModel(1, DiceType.XocXoc)}
            isSmall={false}
            onClickHandle={(id: string, value: number) =>
              this.handleChangeResult(id, value)
            }
          />
        </Row>
      </Modal>
    );
  }

  renderMonitor() {
    const { betList, roundNumber, time, result, gameState, settlementResult } =
      this.state;

    return (
      <Container className={styles["shakeThePlate-container"]}>
        <Row>
          <Col align="center" className={styles["shakeThePlate-timmer"]}>
            <TimeCounter
              remainingTime={time.remainingTime}
              gameState={gameState}
              key={gameState}
            />
            <div>
              <div className={styles.title}>Se Die 3</div>
              <Row className={styles.result}>
                {[0, 1, 2].map((diceIndex) => (
                  <Dice
                    diceModel={result[diceIndex]}
                    isSmall={false}
                    onClickHandle={() => this.openModal(diceIndex)}
                  />
                ))}
              </Row>
              <RoundNum roundNumber={roundNumber} />
            </div>
          </Col>
          <Col align="center" className={styles["shakeThePlate-betList"]}>
            <Col className={styles["col-platered"]}>
              <TotalBet
                type="platered"
                total={betList.red.total}
                isWin={settlementResult.red}
              />
            </Col>
            <Col className={styles["col-platewhite"]}>
              <TotalBet
                type="platewhite"
                total={betList.white.total}
                isWin={settlementResult.white}
              />
            </Col>

            <Col>
              <TotalBet
                type="red3"
                total={betList.red3.total}
                isWin={settlementResult.red3}
              />
            </Col>
            <Col>
              <TotalBet
                type="red2"
                total={betList.red2.total}
                isWin={settlementResult.red2}
              />
            </Col>
            <Col>
              <TotalBet
                type="red1"
                total={betList.red1.total}
                isWin={settlementResult.red1}
              />
            </Col>
            <Col>
              <TotalBet
                type="white3"
                total={betList.white3.total}
                isWin={settlementResult.white3}
              />
            </Col>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { betList, settlementResult } = this.state;

    return (
      <React.Fragment>
        <Col className="col">
          <BetList
            titles={[<div className={styles["title-red"]}>Red</div>]}
            type="simple"
            dataList={betList.red.dataList}
            isWin={settlementResult.red}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles["title-white"]}>White</div>]}
            type="simple"
            dataList={betList.white.dataList}
            isWin={settlementResult.white}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles.red3}></div>]}
            type="simple"
            dataList={betList.red3.dataList}
            isWin={settlementResult.red3}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles.red2}></div>]}
            type="simple"
            dataList={betList.red2.dataList}
            isWin={settlementResult.red2}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles.red1}></div>]}
            type="simple"
            dataList={betList.red1.dataList}
            isWin={settlementResult.red1}
          />
        </Col>

        <Col className="col">
          <BetList
            titles={[<div className={styles.white3}></div>]}
            type="simple"
            dataList={betList.white3.dataList}
            isWin={settlementResult.white3}
          />
        </Col>
      </React.Fragment>
    );
  }
}
