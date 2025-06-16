import React from "react";
import { Button, Col, Container, Row, Card as ReactstrapCard } from "reactstrap";
import BaseMonitoring, {
    BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import { CardModel, Hands, SoloBlackjackGameModel } from "./soloblackjack-model";
import styles from "./soloblackjack.module.scss";
import { Constant, Resources, values, suits, cardSuits } from "./soloblackjack-constants";
import configs from "../../../configs.json";

export default class SoloBlackjackGame extends BaseMonitoring<
    SoloBlackjackGameModel,
    BaseMonitoringProps
> {
    constructor(props: BaseMonitoringProps) {
        super(props);
        this.state = new SoloBlackjackGameModel();
        const bodyElement = document.body;
        bodyElement.style.background = "none";

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //inGameHandler({ inGame }) { }

    handleSubmit() {
        const { gameId, gameName, dealer, hands, name, isSubmited, inputHand1, inputHand4 } = this.state;

        if(name === "") {
            this.setState({
                errorMessage: "Player name cannot be empty",
            });
            return;
        }

        if(inputHand1 === "") {
            this.setState({
                errorMessage: "Hands cannot be empty",
            });
            return;
        }

        const data = {
            name: name,
            dealer: this.transformDealer(dealer),
            hands: this.transformHands([inputHand1, inputHand4])
        }

        if(!this.validateDealerCards(data.dealer)) {
            this.setState({
                errorMessage: "Dealer cards are invalid",
            });
            return;
        }
        
        if(!this.validateHandsCards(data.hands)) {
            this.setState({
                errorMessage: "Hands cards are invalid",
            });
            return;
        }

        const domain = configs.Domain;

        fetch(`https://${domain}/${gameName.toLowerCase()}/api/set-result`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(response => response.json()).then(data => {
            this.setState({
                isSubmited: true,
            });
        }).catch(error => {
            this.setState({
                errorMessage: error.message,
            });
        }).finally(() => {
            setTimeout(() => {
                this.setState({
                    isSubmited: false,
                    errorMessage: "",
                });
            }, Constant.showedSucceedMessegeTimebyMillisecond);
        });   
    }

    private transformDealer(data: string): CardModel[] {
        const dealer: CardModel[] = [];

        if (data.length > 0) {
            const dealerCards = data.split(",");
            dealerCards.forEach(card => {
                dealer.push(this.parseCard(card));
            });
        }

        return dealer;
    }

    private transformHands(data: string[]): Hands[] {
        const hands: Hands[] = [];

        data.forEach((hand, index) => {
            if (hand !== "") {
                const cardsArray = hand.split(",");
                const cards = cardsArray.map(card => this.parseCard(card));
                hands.push({ pos: index + 1, cards: cards });
            }
        });

        return hands;
    }

    private parseCard(card: string): CardModel {
        const cardValue = card.substring(0, card.length - 1).toUpperCase();
        const suit = card[card.length - 1].toLowerCase();

        return {
            rank: cardValue,
            suit: cardSuits[suit]
        };
    }

    private validateDealerCards(cards: CardModel[]): boolean {
        const isRank = cards.every(card => values.includes(card.rank.toString()));
        const isSuit = cards.every(card => suits.includes(card.suit as number));
        return isRank && isSuit;
    }

    private validateHandsCards(data: Hands[]): boolean {
        const isRank = data.every(item => {
            return item.cards.every(card => values.includes(card.rank.toString()));
        });
        const isSuit = data.every(item => {
            return item.cards.every(card => suits.includes(card.suit as number));
        });
        return isRank && isSuit;
    }

    render() {
        const {
            dealer,
            name,
            isSubmited,
            gameState,
            inputHand1,
            inputHand4,
            errorMessage,
        } = this.state;

        return (
            <Container className={styles["center-container"]}>
            <ReactstrapCard className={styles["card"]}>
                <Row>
                    <Col className={`${styles["bold"]}`}>
                        {" "}
                        <h2>{Resources.gameName}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-2">
                        {" "}
                        <label>Nickname</label>
                    </Col>
                    <Col className="col-4">
                        <input
                            className="form-control"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(event) => {
                                this.setState({ name: event.target.value });
                            }}
                        />
                    </Col>
                </Row>
                <Row className={styles["row"]}>
                    <div className={`${styles["bold"]}`}>Set Results: </div> 
                    <div> h: ♥️, d: ♦️, c: ♣️, s: ♠️</div>
                </Row>
                <Row className={styles["row"]}>
                    <div>Example: 10h,Jd,4c,As</div>
                </Row>

                <Row className={``}>
                    <Col className="col-2">
                        {" "}
                        <label>Dealer</label>
                    </Col>
                    <Col className="col-4">
                        <input
                            className="form-control"
                            name="dealer"
                            type="text"
                            value={dealer}
                            onChange={(event) => {   
                                this.setState({ dealer: event.target.value });
                            }}
                        />
                    </Col>
                </Row>

                <Row className={``}>
                    <Col className="col-2">
                        {" "}
                        <label>Hand 1</label>
                    </Col>
                    <Col className="col-4">
                        <input
                            className="form-control"
                            name="hand1"
                            type="text"
                            value={inputHand1}
                            onChange={(event) => {
                                this.setState({ inputHand1: event.target.value });
                            }}
                        />
                    </Col>
                    <Col className="col-2">
                        <label>Hand 4</label>
                    </Col>
                    <Col className="col-4">
                        <input
                            className="form-control"
                            name="hand4"
                            type="text"
                            value={inputHand4}
                            onChange={(event) => {
                                this.setState({ inputHand4: event.target.value });
                            }}
                        />
                    </Col>
                </Row>
                <Row className={``}>
                    <div className="col-10 text-danger">{errorMessage}</div>
                </Row>
                <Row>
                    <Col>
                        <Button
                            color="primary"
                            onClick={this.handleSubmit}
                            className={styles["custom-button"]}
                        >
                            {Resources.submit}
                        </Button>
                    </Col>
                </Row>
                {isSubmited && (
                    <Row>
                        <Col className="col-10">
                            <div className={`${styles["success-message"]}  text-center`}>
                                {Resources.updateSuccessful}
                            </div>
                        </Col>
                    </Row>
                )}
                {gameState == GameState.disabled && (
                    <Notice isOpen={true} message={Resources.disabledMessage} />
                )}
                </ReactstrapCard>
            </Container>
        );
    }
}
