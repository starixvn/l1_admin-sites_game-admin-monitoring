import React from "react";
import { Col, Container, Row } from "reactstrap";
import {
  Win3CardsModel,
  Win3CardsBetList,
} from "../../common/model/Win3CardsModel";
import CardResult from "../../common/model/CardResult";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import BetList from "../../shared/bet-list/bet-list";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import GameTemplate from "../game-template/game-template";
import styles from "../baccarat/styles.module.scss";
import DeskOfCards from "../baccarat/desk-of-cards";
import Win3CardResult from "./win-3-cards-result";
import Win3CardsResultUpdater from "./win-3-cards-result-updater";

const TOTAL_TIME = 30;
const WAITING_TIME = 15;
const DefaultBetList = new Win3CardsBetList();
const DefaultResult = {
  dragonCards: [new CardResult(), new CardResult(), new CardResult()],
  phoenixCards: [new CardResult(), new CardResult(), new CardResult()],
};

const CHOICES = [
  { name: "dragon", displayName: "Dragon" },
  { name: "phoenix", displayName: "Phoenix" },
  { name: "pair8Plus", displayName: "Pair 8 Plus" },
  { name: "threeOfAKind", displayName: "Three of a Kind" },
  { name: "straightFlush", displayName: "Straight Flush" },
  { name: "flush", displayName: "Flush" },
  { name: "straight", displayName: "Straight" },
];

export default class Win3Cards extends BaseMonitoring<
  Win3CardsModel,
  BaseMonitoringProps
> {
  constructor(props) {
    super(props);

    this.state = { ...new Win3CardsModel(), betList: this.defaultBetList };
    this.showUpdater = this.showUpdater.bind(this);
    this.updaterToggle = this.updaterToggle.bind(this);
    this.updaterSubmit = this.updaterSubmit.bind(this);
    this.showDeskOfCards = this.showDeskOfCards.bind(this);
    this.updaterDeskOfCardsToggle = this.updaterDeskOfCardsToggle.bind(this);
    this.onPickCard = this.onPickCard.bind(this);
  }

  get gameName() {
    return "Win 3 Cards";
  }

  get setResultObjectKey() {
    return "set_result";
  }

  get defaultBetList(): {} {
    return DefaultBetList;
  }

  get defaultResult(): any {
    return { ...DefaultResult };
  }

  get totalTimeInRound(): number {
    return TOTAL_TIME;
  }

  get waitingTime(): number {
    return WAITING_TIME;
  }

  getResult(result) {
    const dragonResult: CardResult[] = Object.values(result.dragon.cards);
    const phoenixResult: CardResult[] = Object.values(result.phoenix.cards);
    return {
      dragonCards: dragonResult,
      phoenixCards: phoenixResult,
    };
  }

  showUpdater() {
    this.setState({
      isShowResultUpdater: true,
    });
  }

  checkWinner(choice) {
    const { settlementResult } = this.state;

    return settlementResult && settlementResult[choice];
  }

  showDeskOfCards(selectedCard: string, cardIndex: number) {
    this.setState({
      isShowDeskOfCards: true,
      selectedCard: selectedCard,
      cardIndex: cardIndex,
    });
  }

  renderMonitor() {
    const { time, roundNumber, betList, result } = this.state;
    return (
      <Container fluid>
        <Row>
          <Col className="col-12 col-lg-4">
            <Row className="justify-content-center">
              <Col align="center" className={styles.timecounter}>
                <TimeCounter
                  remainingTime={time.remainingTime}
                  gameState={this.state.gameState}
                  key={this.state.gameState}
                ></TimeCounter>
                <RoundNum roundNumber={roundNumber} />
              </Col>
            </Row>
            <Row>
              <Col align="center" className="col-12 col-xl-6">
                <div className={styles.title}>Dragon</div>
                <Win3CardResult
                  cardResult={result.dragonCards}
                  onCardClick={this.showDeskOfCards}
                  selectedCard="dragonCards"
                />
              </Col>
              <Col align="center" className="col-12 col-xl-6">
                <div className={styles.title}>Phoenix</div>
                <Win3CardResult
                  cardResult={result.phoenixCards}
                  onCardClick={this.showDeskOfCards}
                  selectedCard="phoenixCards"
                />
              </Col>
            </Row>
          </Col>
          <Col align="center" className="col-12 col-lg-1">
            <div className={styles.title}>{this.gameName}</div>
            {!this.props.isProduction && (
              <input
                type="button"
                value="Set Result"
                className={styles["set-button"]}
                onClick={this.showUpdater}
              ></input>
            )}
          </Col>
          <Col className="p-0 col-12 col-lg-7">
            <Row className={styles["row-style"]}>
              <TotalBet
                type="dragonWin3Cards"
                total={betList.dragon.total}
                isWin={this.checkWinner("dragon")}
              />
              <TotalBet
                type="phoenix"
                total={betList.phoenix.total}
                isWin={this.checkWinner("phoenix")}
              />
              <TotalBet
                type="pair8Plus"
                total={betList.pair8Plus.total}
                isWin={this.checkWinner("pair8Plus")}
              />
              <TotalBet
                type="threeOfAKind"
                total={betList.threeOfAKind.total}
                isWin={this.checkWinner("threeOfAKind")}
              />
            </Row>
            <Row className={styles["row-style"]}>
              <TotalBet
                type="straightFlush"
                total={betList.straightFlush.total}
                isWin={this.checkWinner("straightFlush")}
              />
              <TotalBet
                type="flush"
                total={betList.flush.total}
                isWin={this.checkWinner("flush")}
              />
              <TotalBet
                type="straight"
                total={betList.straight.total}
                isWin={this.checkWinner("straight")}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const result = [];
    const _this = this;
    CHOICES.forEach(function (choice, i) {
      result.push(
        <Col className={styles[""]} key={i}>
          <BetList
            type="onecolumn"
            isWin={_this.checkWinner(choice.name)}
            titles={[<div>{choice.displayName}</div>]}
            dataList={_this.state.betList[choice.name].dataList}
          />
        </Col>
      );
    });

    return <React.Fragment>{result}</React.Fragment>;
  }

  renderTitle(value) {
    return <span className={styles["title"]}>{value}</span>;
  }

  updaterToggle() {
    this.setState({
      isShowResultUpdater: !this.state.isShowResultUpdater,
    });
  }

  updaterDeskOfCardsToggle() {
    this.setState({
      isShowDeskOfCards: !this.state.isShowDeskOfCards,
    });
  }

  updaterSubmit(result) {
    const obj = {
      [this.setResultObjectKey]: {
        result: {
          dragon: this.transformCards(result.dragon),
          phoenix: this.transformCards(result.phoenix),
        },
        roundId: this.state.roundNumber + 1,
      },
    };

    this.setState({
      result: {
        dragonCards: result.dragon,
        phoenixCards: result.phoenix,
      },
      isShowResultUpdater: false,
    });
    this.props.sendMessage(obj);
  }

  onPickCard(card: number, type: number) {
    const { result, selectedCard, cardIndex } = this.state;
    let cardResult = new CardResult();
    cardResult.rank = card;
    cardResult.suit = type;
    result[selectedCard][cardIndex] = cardResult;
    this.setState({
      result: result,
      isShowDeskOfCards: false,
    });

    const dragonCards = this.transformCards(result.dragonCards);
    const phoenixCards = this.transformCards(result.phoenixCards);
    if (
      Object.values(dragonCards).find(
        (c) => c["rank"] === undefined || c["suit"] === undefined
      ) ||
      Object.values(phoenixCards).find(
        (c) => c["rank"] === undefined || c["suit"] === undefined
      )
    ) {
      return;
    }
    const message = {
      [this.setResultObjectKey]: {
        result: {
          dragon: dragonCards,
          phoenix: phoenixCards,
        },
        roundId: this.state.roundNumber + 1,
      },
    };
    this.props.sendMessage(message);
  }

  transformCards(cards) {
    return cards.reduce((result, card, index) => {
      result[`card${index + 1}`] = card;
      return result;
    }, {});
  }

  render() {
    return (
      <div>
        <GameTemplate
          renderBetList={this.renderBetList}
          renderMonitor={this.renderMonitor}
          onChangePartnerFilter={this.onChangePartnerFilter}
          onChangeSystemFilter={this.onChangeSystemFilter}
          disabled={this.state.disabled}
          enableFilter={true}
          partners={this.props.partners}
        ></GameTemplate>
        {!this.props.isProduction && (
          <Win3CardsResultUpdater
            modal={this.state.isShowResultUpdater}
            toggle={this.updaterToggle}
            submit={this.updaterSubmit}
          />
        )}
        {!this.props.isProduction && (
          <DeskOfCards
            isOpen={this.state.isShowDeskOfCards}
            toggle={this.updaterDeskOfCardsToggle}
            onPickCard={this.onPickCard}
          />
        )}
      </div>
    );
  }
}
