import _ from "lodash";
import React from "react";
import { Col, Container, Modal, Row } from "reactstrap";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import BetList from "../../shared/bet-list/bet-list";
import Dice from "../../shared/dice/dice";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import styles from "./kara-krus.module.scss";
import KaraKrusModel, { KaraKrusBetList, KaraKrusSettlementResult } from "../../common/model/KaraKrusModel";

const DefaultResult = [
  new DiceModel(-1, DiceType.KaraKrus),
  new DiceModel(-1, DiceType.KaraKrus),
  new DiceModel(-1, DiceType.KaraKrus),
];

const DefaultSettlementResult = new KaraKrusSettlementResult();
const DefaultBetList = new KaraKrusBetList();

export default class KaraKrus extends BaseMonitoring<
  KaraKrusModel,
  BaseMonitoringProps
> {
  constructor(props) {
    super(props);

    this.state = new KaraKrusModel();
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
      result.push(new DiceModel(data[key] ? 1 : 0, DiceType.KaraKrus));
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

      gameResult[`head${index + 1}`] = !!diceInfo.value;
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
          (dice) => new DiceModel(+dice, DiceType.KaraKrus)
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
            diceModel={new DiceModel(0, DiceType.KaraKrus)}
            isSmall={false}
            onClickHandle={(id: string, value: number) =>
              this.handleChangeResult(id, value)
            }
          />
          <Dice
            key={`dice-select-${1}`}
            diceModel={new DiceModel(1, DiceType.KaraKrus)}
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
              <div className={styles.title}>Kara Krus</div>
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
            <Col className={styles["col-platekara"]}>
              <TotalBet
                type="platekara"
                total={betList.kara.total}
                isWin={settlementResult.kara}
              />
            </Col>
            <Col className={styles["col-platekrus"]}>
              <TotalBet
                type="platekrus"
                total={betList.krus.total}
                isWin={settlementResult.krus}
              />
            </Col>

            <Col>
              <TotalBet
                type="head3"
                total={betList.head3.total}
                isWin={settlementResult.head3}
              />
            </Col>
            <Col>
              <TotalBet
                type="head2"
                total={betList.head2.total}
                isWin={settlementResult.head2}
              />
            </Col>
            <Col>
              <TotalBet
                type="head1"
                total={betList.head1.total}
                isWin={settlementResult.head1}
              />
            </Col>
            <Col>
              <TotalBet
                type="tail3"
                total={betList.tail3.total}
                isWin={settlementResult.tail3}
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
            titles={[<div className={styles["title-kara"]}>Kara</div>]}
            type="simple"
            dataList={betList.kara.dataList}
            isWin={settlementResult.kara}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles["title-krus"]}>Krus</div>]}
            type="simple"
            dataList={betList.krus.dataList}
            isWin={settlementResult.krus}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles.head3}></div>]}
            type="simple"
            dataList={betList.head3.dataList}
            isWin={settlementResult.head3}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles.head2}></div>]}
            type="simple"
            dataList={betList.head2.dataList}
            isWin={settlementResult.head2}
          />
        </Col>
        <Col className="col">
          <BetList
            titles={[<div className={styles.head1}></div>]}
            type="simple"
            dataList={betList.head1.dataList}
            isWin={settlementResult.head1}
          />
        </Col>

        <Col className="col">
          <BetList
            titles={[<div className={styles.tail3}></div>]}
            type="simple"
            dataList={betList.tail3.dataList}
            isWin={settlementResult.tail3}
          />
        </Col>
      </React.Fragment>
    );
  }
}
