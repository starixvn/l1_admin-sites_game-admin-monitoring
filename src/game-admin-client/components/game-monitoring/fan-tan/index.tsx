import React from "react";
import styles from "./index.module.scss";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import { Col, Container, Modal, Row } from "reactstrap";
import BetList from "../../shared/bet-list/bet-list";
import RoundNum from "../../shared/round-num/round-num";
import { FanTanModel, FanTanBetList } from "../../common/model/FantanModel";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import _ from "lodash";

const MinBeads = 29;

export default class FanTan extends BaseMonitoring<
  FanTanModel,
  BaseMonitoringProps
> {
  constructor(props) {
    super(props);

    this.state = new FanTanModel();
  }

  get totalTimeInRound(): number {
    return 50;
  }

  get waitingTime(): number {
    return 8;
  }

  get defaultResult(): any {
    return {
      totalBeads: 0,
      finalBeads: 0,
    };
  }

  get defaultBetList(): {} {
    return new FanTanBetList();
  }

  getResult(data) {
    return data;
  }

  toggleModal() {
    this.setState({
      isOpenControlResultModal: !this.state.isOpenControlResultModal,
    });
  }

  openModal() {
    this.setState({
      isOpenControlResultModal: true,
    });
  }

  handleChangeResult(value) {
    const formattedResult = {
      totalBeads: value,
      finalBeads: value % 4 === 0 ? 4 : value % 4,
    };

    this.setState({
      result: formattedResult,
      isOpenControlResultModal: false,
      nextRoundResult: value,
    });

    this.props.sendMessage({
      set_result: {
        result: formattedResult,
        roundId: this.state.roundNumber + 1,
      },
    });
  }

  finishHandler({ finish }) {
    super.finishHandler({ finish });
    setTimeout(() => {
      const nextRoundResult = this.state.nextRoundResult;
      let result = this.defaultResult;
      if (!nextRoundResult) {
        result = nextRoundResult;
      }
      this.setState({
        result,
        nextRoundResult: 0,
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
        {[1, 2, 3].map((row) => (
          <Row>
            {[1, 2, 3, 4].map((col) => {
              const value = MinBeads + (row - 1) * 4 + col - 1;

              return (
                <button onClick={() => this.handleChangeResult(value)}>
                  {value}
                </button>
              );
            })}
          </Row>
        ))}
      </Modal>
    );
  }

  renderMonitor() {
    const { betList, roundNumber, time, result, gameState } = this.state;

    return (
      <Container className={styles["fantan-container"]}>
        <Row>
          <Col align="center" className={styles["fantan-timmer"]}>
            <TimeCounter
              remainingTime={time.remainingTime}
              gameState={gameState}
            />
            <div>
              <div className={styles.title}>Fan Tan</div>
              <RoundNum roundNumber={roundNumber} />
              <div onClick={() => this.openModal()} className={styles.result}>
                {result.totalBeads > 0
                  ? `${result.totalBeads} - ${result.finalBeads} `
                  : ""}
              </div>
            </div>
          </Col>
          <Col align="center" className={styles["fantan-betList"]}>
            <Col className={styles["col-plateeven"]}>
              <TotalBet
                type="fantanEven"
                total={betList.even.total}
                isWin={false}
              />
            </Col>
            <Col className={styles["col-plateodd"]}>
              <TotalBet
                type="fantanOdd"
                total={betList.odd.total}
                isWin={false}
              />
            </Col>
            <Col>
              <TotalBet
                type="fantanFan"
                total={
                  betList.fan1.total +
                  betList.fan2.total +
                  betList.fan3.total +
                  betList.fan4.total
                }
                isWin={false}
              />
            </Col>
            <Col>
              <TotalBet
                type="fantanKwok"
                total={
                  betList.kwok12.total +
                  betList.kwok23.total +
                  betList.kwok34.total +
                  betList.kwok41.total
                }
                isWin={false}
              />
            </Col>
            <Col>
              <TotalBet
                type="fantanChun"
                total={
                  betList.chun123.total +
                  betList.chun124.total +
                  betList.chun134.total +
                  betList.chun234.total
                }
                isWin={false}
              />
            </Col>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { betList } = this.state;

    return (
      <React.Fragment>
        <Col className="col-2 offset-1">
          <BetList
            titles={[<div className={styles.bondo}>Even</div>]}
            type="simple"
            dataList={betList.even.dataList}
            isWin={false}
          />
        </Col>
        <Col className="col-2">
          <BetList
            titles={[<div className={styles.bondo}>Odd</div>]}
            type="simple"
            dataList={betList.odd.dataList}
            isWin={false}
          />
        </Col>
        <Col className="col-2">
          <BetList
            titles={[<div className={styles.bondo}>Fan</div>]}
            type="withchoice"
            dataList={betList.fan1.dataList.concat(
              betList.fan2.dataList,
              betList.fan3.dataList,
              betList.fan4.dataList
            )}
            isWin={false}
          />
        </Col>
        <Col className="col-2">
          <BetList
            titles={[<div className={styles.bondo}>Knok</div>]}
            type="withchoice"
            dataList={betList.kwok12.dataList.concat(
              betList.kwok23.dataList,
              betList.kwok34.dataList,
              betList.kwok41.dataList
            )}
            isWin={false}
          />
        </Col>
        <Col className="col-2">
          <BetList
            titles={[<div className={styles.bondo}>Chun</div>]}
            type="withchoice"
            dataList={betList.chun123.dataList.concat(
              betList.chun124.dataList,
              betList.chun134.dataList,
              betList.chun234.dataList
            )}
            isWin={false}
          />
        </Col>
      </React.Fragment>
    );
  }
}
