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

const numberOfCardsEachRound = 6;

export default class BlockChainBaccarat extends Baccarat {
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
      startBlockchainIndexNewRound: blockchain.currentIndex + 1
    });
  }

  finishHandler({ finish }) {
    super.finishHandler({ finish });
    this.timeout = setTimeout(() => {
      this.setState({
        startBlockchainIndexNewRound: finish.blockchain.currentIndex + 1,
      });
    }, this.waitingTime * 1000);
  }

  padToThree(number: number) {
    return number <= 999 ? (`00${number}`).slice(-3) : number.toString();
  }

  buildEmptyCardsWhenFaceDown() {
    const { startBlockchainIndexNewRound } = this.state;
    let playerCards = [], bankerCards = [], emptyCards = [];
    for (let i = 0; i < numberOfCardsEachRound; i++) {
      const cardTmp = { index: this.padToThree(startBlockchainIndexNewRound + i) };
      if (i > 3) {
        emptyCards.push(cardTmp);
      }
      else {
        i % 2 === 0 ? playerCards.push(cardTmp) : bankerCards.push(cardTmp);
      }
    }

    return { playerCards, bankerCards, emptyCards };
  }

  buildCardsWhenFaceUp() {
    const { result, startBlockchainIndexNewRound } = this.state;

    let playerCards = [], bankerCards = [], emptyCards = [];
    let playerCardIndex = startBlockchainIndexNewRound;
    for (let i = 0; i < 2; i++) {
      playerCards.push({
        rank: result.playerCards[i].rank, suit: result.playerCards[i].suit, index: this.padToThree(playerCardIndex++)
      });

      bankerCards.push({
        rank: result.bankerCards[i].rank, suit: result.bankerCards[i].suit, index: this.padToThree(playerCardIndex++)
      })
    }

    if (!isEmpty(result.playerCards[2])) {
      playerCards.push({
        rank: result.playerCards[2].rank, suit: result.playerCards[2].suit, index: this.padToThree(playerCardIndex++)
      });
    }

    if (!isEmpty(result.bankerCards[2])) {
      bankerCards.push({
        rank: result.bankerCards[2].rank, suit: result.bankerCards[2].suit, index: this.padToThree(playerCardIndex)
      });
    }

    const totalFaceUpCards = playerCards.length + bankerCards.length;

    for (let i = 0; i < numberOfCardsEachRound - totalFaceUpCards; i++) {
      emptyCards.push({ index: this.padToThree(startBlockchainIndexNewRound + totalFaceUpCards + i) });
    }

    return { playerCards, bankerCards, emptyCards };
  }

  renderMonitor() {
    const { time, roundNumber, betList, result } = this.state;
    const isFaceUpCard = !this.isFirstLoad && result.playerCards.some(item => !isEmpty(item));
    const { playerCards, bankerCards, emptyCards } = isFaceUpCard ? this.buildCardsWhenFaceUp() : this.buildEmptyCardsWhenFaceDown();

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
      cards: playerCards
    },
    {
      title: 'Banker',
      cards: bankerCards
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
