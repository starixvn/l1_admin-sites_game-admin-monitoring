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
import blockChainStyles from "./blockchain-baccarat.module.scss";
import { isEmpty } from "lodash";
import CardResult from "../../common/model/CardResult";

const numberOfCardsEachRound = 6;

export default class BlockChainBaccarat extends Baccarat {
  constructor(props) {
    super(props);

    this.buildEmptyCards = this.buildEmptyCards.bind(this);
  }

  get gameName() {
    return "Blockchain Baccarat";
  }

  handleData(data) {
    super.handleData(data);

    if (!!data.blockchain) {
      this.blockchainHandler(data);
    }
  }

  blockchainHandler({ blockchain }) {
    this.setState({
      currentBlockchainIndex: blockchain.currentIndex
    });
  }

  finishHandler({ finish }) {
    super.finishHandler({ finish });
    this.timeout = setTimeout(() => {
      this.setState({
        currentBlockchainIndex: finish.blockchain.currentIndex,
      });
    }, this.waitingTime * 1000);
  }

  padToThree(number: number) {
    if (number <= 999) {
      return (`00${number}`).slice(-3);
    }

    return number.toString();
  }

  buildEmptyCards(currentIndexBankerCards: number) {
    const { currentBlockchainIndex } = this.state;
    const numberOfFaceUpCards = currentIndexBankerCards - currentBlockchainIndex;
    const numberOfEmptyCards = numberOfCardsEachRound - numberOfFaceUpCards;
    let emptyCards = [];
    for (let i = 0; i < numberOfEmptyCards; i++) {
      emptyCards.push({ index: this.padToThree(currentIndexBankerCards + i) });
    }

    return emptyCards;
  }

  buildIndexCardsForEachSession(originalCards: Array<CardResult>, isFaceUpCard: boolean, currentIndex: number) {
    const cards = originalCards.map((item: CardResult) => {
      if (isFaceUpCard) {
        if (!isEmpty(item)) {
          return {
            rank: item.rank, suit: item.suit, index: this.padToThree(currentIndex++)
          };
        }
      }
      else {
        return { index: this.padToThree(currentIndex++) };
      }
    });

    return { cards, currentIndex };
  }

  buildIndexCards() {
    const { result, currentBlockchainIndex } = this.state;
    const isFaceUpCard = result.playerCards.some(item => !isEmpty(item));
    let currentIndex = currentBlockchainIndex;

    const playerCards = this.buildIndexCardsForEachSession(result.playerCards, isFaceUpCard, currentIndex);
    const bankerCards = this.buildIndexCardsForEachSession(result.bankerCards, isFaceUpCard, playerCards.currentIndex);
    const emptyCards = this.buildEmptyCards(bankerCards.currentIndex);

    return { playerCards, bankerCards, emptyCards };
  }

  renderMonitor() {
    const { time, roundNumber, betList } = this.state;
    const { playerCards, bankerCards, emptyCards } = this.buildIndexCards();

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
      cards: playerCards.cards
    },
    {
      title: 'Banker',
      cards: bankerCards.cards
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
                  <BlockchainBaccaratCardResult cards={cardRow.cards} />
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
            {emptyCards.length > 0 && <Row className={blockChainStyles["empty-card"]}>
              <Col>
                <BlockchainBaccaratCardResult cards={emptyCards} />
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
