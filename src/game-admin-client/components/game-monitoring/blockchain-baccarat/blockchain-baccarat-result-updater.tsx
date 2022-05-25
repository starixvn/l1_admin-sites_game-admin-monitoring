import React from "react";
import styles from "../baccarat/baccarat-result-updater.module.scss";
import {
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";
import Chance from "chance";
import blockChainStyles from "./blockchain-baccarat.module.scss";

type Props = {
  modal: boolean;
  toggle: Function;
  submit: Function;
  sendMessage: Function;
  isMini?: boolean;
};

type State = {
  modal: boolean;
  errors: string;
};

export type BlockchainBaccaratCard = {
  rank: number;
  suit: number;
  index?: string;
}

const cardLabels = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = [0, 1, 2, 3];

export default class BlockchainBaccaratResultUpdater extends React.Component<
  Props,
  State
> {
  cutCardIndex: number;
  minCutCard: number;
  maxCutCard: number;
  cards: Array<BlockchainBaccaratCard>;


  constructor(props: any) {
    super(props);

    this.state = {
      modal: false,
      errors: ""
    };

    this.cutCardIndex = 0;
    this.minCutCard = 259;
    this.maxCutCard = 298;
    this.cards = [];

    this.handleCutCardChange = this.handleCutCardChange.bind(this);
    this.handleResultChange = this.handleResultChange.bind(this);

    this.toggle = this.toggle.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleCutCardChange(event: React.SyntheticEvent<EventTarget>) {
    const { minCutCard, maxCutCard } = this;
    let cutCartelm = event.target as HTMLInputElement;
    let cutIndex = parseInt(cutCartelm.value);

    if (isNaN(cutIndex) || cutIndex < minCutCard) {
      this.cutCardIndex = minCutCard;
      cutCartelm.value = minCutCard.toString();
    }

    if (cutIndex > maxCutCard) {
      this.cutCardIndex = maxCutCard;
      cutCartelm.value = maxCutCard.toString();
    }
  }

  handleResultChange(event: React.SyntheticEvent<EventTarget>) {
    const chance = new Chance();
    const cardsRaw = (event.target as HTMLInputElement).value.split(",");

    let count = 0;
    cardsRaw.forEach(item => {
      if (count < 416) {
        this.cards.push({ rank: cardLabels.indexOf(item), suit: chance.pickone(suits) });
      }
      count++;
    });
  }

  toggle() {
    this.props.toggle();
  }

  submit() {
    const { cutCardIndex, cards } = this;
    this.props.sendMessage({ set_result: { result: { cards, cutCardIndex } } });
  }

  render() {
    const { minCutCard, maxCutCard } = this;
    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.toggle}
        className={`${styles["result-updater"]} ${blockChainStyles["blockchain-baccrat-popup"]}`}
      >
        <ModalHeader
          className={styles["custom-modal-header"]}
          toggle={this.toggle}
        ></ModalHeader>
        <ModalBody className={styles["modal-content"]}>
          <Row>
            <Col className={blockChainStyles["results"]} align="center">
              <div>
                Results:
              </div>
              <div><input
                type="text"
                onChange={this.handleResultChange} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col className={blockChainStyles["cut-card"]} align="center">
              <div>
                {`Cut-Card: =< ${minCutCard}`}
              </div>
              <div>
                <input
                  type="number"
                  min={minCutCard}
                  max={maxCutCard}
                  onChange={this.handleCutCardChange} />
              </div>
              <div>
                {`=< ${maxCutCard}`}
              </div>
            </Col>
          </Row>
          <Row className={styles["errors"]}>
            <div>{this.state.errors}</div>
          </Row>
        </ModalBody>
        <ModalFooter className={styles["custom-modal-footer"]}>
          <Button
            color="primary"
            onClick={this.submit}
            className={styles["custom-button"]}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
