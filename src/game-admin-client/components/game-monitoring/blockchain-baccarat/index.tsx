import Baccarat from "../baccarat";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import BlockchainBaccaratCardResult from "./blockchain-baccarat-card-result";
import styles from "../baccarat/styles.module.scss";

import GameTemplate from "../game-template/game-template";

import BlockchainBaccaratResultUpdater from "./blockchain-baccarat-result-updater";
import DeskOfCards from "../baccarat/desk-of-cards";
import { GameState } from "../../shared/common/GameState";
import blockChainStyles from "./blockchain-baccarat.module.scss";

export default class BlockChainBaccarat extends Baccarat {
  currentIndex: number;
  constructor(props) {
    super(props);

    this.currentIndex = 0;
    this.buildEmptyCards = this.buildEmptyCards.bind(this);
  }

  get gameName() {
    return "Blockchain Baccarat";
  }

  finishHandler({ finish }) {
    this.isFirstLoad = false;

    this.setState({
      result: this.getResult(finish.result),
      currentBlockchainIndex: finish.blockchain.currentIndex,
      settlementResult: this.getSettlementResult(finish.settlementResult),
      gameState: GameState.waiting,
      time: {
        remainingTime: this.waitingTime,
      },
    });

    this.timeout = setTimeout(() => {
      this.setState({
        ...this.defaultState,
        gameState: GameState.running,
        roundNumber: this.state.roundNumber + 1,
        time: {
          remainingTime: this.totalTimeInRound,
        },
      });
    }, this.waitingTime * 1000);
  }

  padToThree(number: number) {
    if (number <= 999) {
      return (`00${number}`).slice(-3);
    }

    return number.toString();
  }

  buildEmptyCards() {
    const { result, currentBlockchainIndex } = this.state;

    let numberOfEmptyCards = 6;
    Object.values(result.playerCards.concat(result.bankerCards)).forEach(card => card && numberOfEmptyCards--);

    let emptyCards = [];
    for (let i = 1; i <= numberOfEmptyCards; i++) {
      emptyCards.push({ index: this.padToThree(currentBlockchainIndex + i) });
    }

    return emptyCards;
  }

  renderMonitor() {
    const { time, roundNumber, betList, result } = this.state;
    const emptyCards = this.buildEmptyCards();

    const totalbetRows = {
      firstRow: [{
        type: 'player',
        total: betList.player.total,
        isWin: this.checkWinner("player")
      },
      {
        type: 'banker',
        total: betList.banker.total,
        isWin: this.checkWinner("banker")
      },
      {
        type: 'baccaratBig',
        total: betList.big.total,
        isWin: this.checkWinner("big")
      },
      {
        type: 'baccaratSmall',
        total: betList.small.total,
        isWin: this.checkWinner("small")
      }],
      secondRow: [{
        type: 'tie',
        total: betList.tie.total,
        isWin: this.checkWinner("tie")
      },
      {
        type: 'playerPair',
        total: betList.playerPair.total,
        isWin: this.checkWinner("playerPair")
      },
      {
        type: 'bankerPair',
        total: betList.bankerPair.total,
        isWin: this.checkWinner("bankerPair")
      }]
    };

    const cardRows = [{
      title: 'Player',
      cards: result.playerCards
    },
    {
      title: 'Banker',
      cards: result.bankerCards
    }];

    return (
      <Container fluid>
        <Row>
          <Col className="col-12 col-lg-3">
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
            {
              Object.values(cardRows).map((cardRow, cardRowIndex) => <Row key={cardRowIndex}>
                <Col align="center" className="justify-content-center">
                  <div className={styles.title}>{cardRow.title}</div>
                  <BlockchainBaccaratCardResult
                    cardResult={cardRow.cards}
                  />
                </Col>
              </Row>)
            }
          </Col >
          <Col align="center" className="col-12 col-lg-3">
            <Row>
              <Col>
                <div className={styles.title}>{this.gameName}</div>
                {!this.props.isProduction && (
                  <div><input
                    type="button"
                    value="Set Result"
                    className={styles["set-button"]}
                    onClick={this.showUpdater} /></div>
                )}
              </Col >
            </Row>
            {emptyCards.length < 6 && <Row className={blockChainStyles["empty-card"]}>
              <Col>
                <BlockchainBaccaratCardResult
                  cardResult={emptyCards}
                  isShowCardIndex={true}
                />
              </Col >
            </Row>
            }
          </Col>
          <Col className="p-0 col-12 col-lg-6">
            {
              Object.values(totalbetRows).map((row, rowIndex) => <Row className={styles["row-style"]} key={rowIndex}>
                {
                  Object.values(row).map((totalbet, totalbetIndex) => <TotalBet key={totalbetIndex} {...totalbet} />)
                }
              </Row>)
            }
          </Col>
        </Row >
      </Container >
    );
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
        $
        {!this.props.isProduction && (
          <BlockchainBaccaratResultUpdater
            modal={this.state.isShowResultUpdater}
            toggle={this.updaterToggle}
            submit={this.updaterSubmit}
            sendMessage={this.props.sendMessage}
            isProduction={this.props.isProduction}
          />
        )}
        $
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
