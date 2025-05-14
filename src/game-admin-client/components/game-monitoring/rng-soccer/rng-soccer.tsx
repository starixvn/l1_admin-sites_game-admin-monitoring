import React from "react";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import GameTemplate from "../game-template/game-template";
import BetList from "../../shared/bet-list/bet-list";
import { Container, Row, Col } from "reactstrap";
import RoundNum from "../../shared/round-num/round-num";
import styles from "./rng-soccer.module.scss";
import CardResult from "../../common/model/CardResult";
import RngSoccerModel, { RngSoccerBetList } from "../../common/model/RngSoccerModel";
import { upperFirstLetter } from "../../util/util";
import { GameState } from "../../shared/common/GameState";
import DeskOfCards from "../baccarat/desk-of-cards";
import BaseMonitoring, { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";
import RngSoccerResult from "../../shared/rng-soccer-result/rng-soccer-result";

const TYPES = ["home", "draw", "away"];
const TOTAL_TIME = 20;
const WAITING_TIME = 5;

enum CardResultMapping {
  home,
  away,
}

export default class RngSoccerState extends BaseMonitoring<RngSoccerModel, BaseMonitoringProps> {
  constructor(props) {
    super(props);

    this.state = {
      ...new RngSoccerModel(),
      result: this.defaultResult,
      betList: this.defaultBetList,
    };

    this.showDeskOfCards = this.showDeskOfCards.bind(this);
    this.onPickCard = this.onPickCard.bind(this);
    this.updaterDeskOfCardsToggle = this.updaterDeskOfCardsToggle.bind(this);
  }

  get defaultBetList(): {} {
    return new RngSoccerBetList();
  }

  get defaultResult(): any {
    return [new CardResult(), new CardResult()];
  }

  get totalTimeInRound(): number {
    return TOTAL_TIME;
  }

  get waitingTime(): number {
    return WAITING_TIME;
  }

  getCardResult(resultObj) {
    const cardResult = new CardResult();
    cardResult.card = resultObj.card;
    cardResult.type = resultObj.type;
    cardResult.rank = resultObj.rank;
    cardResult.suit = resultObj.suit;

    return cardResult;
  }

  getResult(result) {
    return [
      this.getCardResult(result.home),
      this.getCardResult(result.away),
    ];
  }

  updaterDeskOfCardsToggle() {
    this.setState({
      isShowDeskOfCards: !this.state.isShowDeskOfCards,
    });
  }

  showDeskOfCards(selectedCard: string) {
    this.setState({
      isShowDeskOfCards: true,
      selectedCard: selectedCard,
    });
  }

  getWiner() {
    const { result } = this.state;
    const [home, away] = result;

    let winer = home.rank > away.rank ? "home" : "away";
    winer = home.rank == away.rank ? "draw" : winer;

    return winer;
  }

  renderMonitor() {
    const { gameState, result, betList, time, roundNumber } = this.state;
    const winer = this.state.gameState == GameState.waiting ? this.getWiner() : "";
    //console.log(result[0].card, result[1].card);
    return (
      <Container className={styles["rngSoccer-container"]}>
        <Row>
          <Col className="col-12 col-lg-4">
            <Row>
              <div className={styles.counter}>
                <div className={styles.title}>RNG Soccer</div>
                <TimeCounter
                  remainingTime={time.remainingTime}
                  gameState={gameState}
                  key={gameState}
                />
                <RoundNum roundNumber={roundNumber} />
              </div>
            </Row>
          </Col>

          <Col align="center"></Col>

          <Col align="center">
            <Row>
              <Col>
                <RngSoccerResult
                  result={result}
                  onClickCard={this.showDeskOfCards}
                />
              </Col>
            </Row>
            <Row>
              <Col className={styles.draw}>
                <TotalBet
                  type="draw"
                  total={betList.draw.total}
                  isWin={winer == "draw"}
                />
              </Col>
            </Row>
          </Col>

          <Col align="center"></Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { betList } = this.state;
    const winer = this.state.gameState == GameState.waiting ? this.getWiner() : "";

    const result = [];
    const _this = this;
    TYPES.forEach((type, i) => {
      result.push(
        <Col className="p-1" key={i}>
          <BetList
            type="simple"
            titles={[_this.renderTitle(upperFirstLetter(type))]}
            dataList={betList[type].dataList}
            isWin={winer == type}
          />
        </Col>
      );
    });

    return (
      <Container>
        <Row>{result}</Row>
      </Container>
    );
  }

  onPickCard(card: number, type: number) {
    const { gameState, selectedCard, result, roundNumber } = this.state;

    const newResult = result.map((cardInfo, index) => {
      if (CardResultMapping[selectedCard] == index || !cardInfo.card) {
        cardInfo.card = card;
        cardInfo.type = type;
        cardInfo.rank = card;
        cardInfo.suit = type;
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
          home: {
            rank: result[CardResultMapping.home].rank,
            suit: result[CardResultMapping.home].suit,
          },
          away: {
            rank: result[CardResultMapping.away].rank,
            suit: result[CardResultMapping.away].suit,
          },
        },
        roundId: gameState == GameState.running ? roundNumber : roundNumber + 1,
      },
    };

    this.props.sendMessage(message);
  }

  renderTitle(title) {
    return <div>{title}</div>;
  }

  render() {
    return (
      <div className={styles.rngsoccer}>
        <GameTemplate
          renderBetList={this.renderBetList}
          renderMonitor={this.renderMonitor}
          onChangePartnerFilter={this.onChangePartnerFilter}
          onChangeSystemFilter={this.onChangeSystemFilter}
          disabled={this.state.gameState == GameState.disabled}
          enableFilter={true}
          partners={this.props.partners}
        />
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