import React from "react";
import { Col, Container, Row } from "reactstrap";
import CardResult from "../../common/model/CardResult";
import { DragonTigerFightBetList } from "../../common/model/DragonTigerFightModel";
import BetList from "../../shared/bet-list/bet-list";
import DragonTigerResult from "../../shared/dragon-tiger-result/dragon-tiger-result";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import DragonTigerState from "../dragon-tiger/dragon-tiger";
import styles from "../dragon-tiger/dragon-tiger.module.scss";

const CHOICES = [
  { name: "dragon", displayName: "Dragon" },
  { name: "tiger", displayName: "Tiger" },
  { name: "blackDragon", displayName: "Black Dragon" },
  { name: "redDragon", displayName: "Red Dragon" },
  { name: "tie", displayName: "Tie" },
  { name: "blackTiger", displayName: "Black Tiger" },
  { name: "redTiger", displayName: "Red Tiger" },
];
const WAITING_TIME = 9;

enum CardResultMapping {
  dragon,
  tiger,
}

export default class DragonTigerFightState extends DragonTigerState {
  constructor(props) {
    super(props);
  }

  get waitingTime(): number {
    return WAITING_TIME;
  }

  get defaultBetList(): {} {
    return new DragonTigerFightBetList();
  }

  getCardResult(resultObj) {
    const cardResult = new CardResult();
    cardResult.card = resultObj.rank;
    cardResult.type = resultObj.suit;

    return cardResult;
  }

  checkWinner(choice) {
    const { settlementResult } = this.state;

    return settlementResult?.[choice];
  }

  renderMonitor() {
    const { gameState, result, betList, time, roundNumber } = this.state;

    return (
      <Container className={styles["dragonTiger-container"]}>
        <Row>
          <Col className="col-12 col-lg-4">
            <Row>
              <div className={styles.counter}>
                <div className={styles.title}>Dragon Tiger Fight</div>
                <TimeCounter
                  remainingTime={time.remainingTime}
                  gameState={gameState}
                  key={gameState}
                />
                <RoundNum roundNumber={roundNumber} />
              </div>
            </Row>
          </Col>
          <Col align="center">
            <Row>
              <Col>
                <TotalBet
                  type="dragon"
                  total={betList.dragon.total}
                  isWin={this.checkWinner("dragon")}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TotalBet
                  type="blackDragon"
                  total={betList.blackDragon.total}
                  isWin={this.checkWinner("blackDragon")}
                />
              </Col>
              <Col>
                <TotalBet
                  type="redDragon"
                  total={betList.redDragon.total}
                  isWin={this.checkWinner("redDragon")}
                />
              </Col>
            </Row>
          </Col>
          <Col align="center">
            <Row>
              <Col>
                <DragonTigerResult
                  result={result}
                  onClickCard={this.showDeskOfCards}
                />
              </Col>
            </Row>
            <Row>
              <Col className={styles.draw}>
                <TotalBet
                  type="draw"
                  total={betList.tie.total}
                  isWin={this.checkWinner("tie")}
                />
              </Col>
            </Row>
          </Col>
          <Col align="center">
            <Row>
              <Col>
                <TotalBet
                  type="tiger"
                  total={betList.tiger.total}
                  isWin={this.checkWinner("tiger")}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TotalBet
                  type="blackTiger"
                  total={betList.blackTiger.total}
                  isWin={this.checkWinner("blackTiger")}
                />
              </Col>
              <Col>
                <TotalBet
                  type="redTiger"
                  total={betList.redTiger.total}
                  isWin={this.checkWinner("redTiger")}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { betList } = this.state;
    const result = [];
    const _this = this;
    CHOICES.forEach((choice, i) => {
      result.push(
        <Col key={i}>
          <BetList
            type="simple"
            titles={[choice.displayName]}
            dataList={betList[choice.name].dataList}
            isWin={_this.checkWinner(choice.name)}
          />
        </Col>
      );
    });

    return <React.Fragment>{result}</React.Fragment>;
  }

  onPickCard(card: number, type: number) {
    const { selectedCard, result, roundNumber } = this.state;

    const newResult = result.map((cardInfo, index) => {
      if (
        CardResultMapping[selectedCard] == index ||
        cardInfo.card === undefined
      ) {
        cardInfo.card = card;
        cardInfo.type = type;
      }

      return cardInfo;
    });

    this.setState({
      result: newResult,
      isShowDeskOfCards: false,
    });

    const message = {
      set_result: {
        result: {
          dragon: {
            rank: result[CardResultMapping.dragon].card,
            suit: result[CardResultMapping.dragon].type,
          },
          tiger: {
            rank: result[CardResultMapping.tiger].card,
            suit: result[CardResultMapping.tiger].type,
          },
        },
        roundId: roundNumber + 1,
      },
    };

    this.props.sendMessage(message);
  }
}
