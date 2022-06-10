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
  isProduction: boolean;
};

type State = {
  modal: boolean;
  cutCardIndex: number;
  cards: Array<BlockchainBaccaratCard>;
  isValidCutCardIndex: boolean;
  isValidResult: boolean;
  isSubmitSuccessfully: boolean;
};

export type BlockchainBaccaratCard = {
  rank: number;
  suit: number;
  index?: string;
}

const cardLabels = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = [0, 1, 2, 3];
const timeoutHideMessage = 1500;
const minCutCard = 0, maxCardIndex = 416;
const resources = {
  submit: 'Submit',
  cutCard: 'Cut-Card: ',
  result: 'Result:',
  setResultSuccessfully: 'Set results successfully.'
}

export default class BlockchainBaccaratResultUpdater extends React.Component<
  Props,
  State
> {
  constructor(props: any) {
    super(props);

    this.state = {
      modal: false,
      cutCardIndex: 0,
      cards: [],
      isValidCutCardIndex: false,
      isValidResult: false,
      isSubmitSuccessfully: false
    };

    this.handleCutCardChange = this.handleCutCardChange.bind(this);
    this.handleResultChange = this.handleResultChange.bind(this);

    this.toggle = this.toggle.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleCutCardChange(event: React.SyntheticEvent<EventTarget>) {
    const cutCardIndexTmp = parseInt((event.target as HTMLInputElement).value);

    const inValid = isNaN(cutCardIndexTmp) || cutCardIndexTmp < minCutCard || cutCardIndexTmp > maxCardIndex;
    this.setState({ isValidCutCardIndex: !inValid });
    this.setState({ cutCardIndex: cutCardIndexTmp });
  }

  handleResultChange(event: React.SyntheticEvent<EventTarget>) {
    const chance = new Chance();
    const cardsRaw = (event.target as HTMLInputElement).value.split(",");

    let count = 0;
    let cardsTemp = []
    cardsRaw.forEach(item => {
      if (!isNaN(parseInt(item))) {
        cardsTemp.push({ rank: cardLabels.indexOf(item), suit: chance.pickone(suits) });
        count++;
      }

      this.setState({ isValidResult: count > 0 && count < maxCardIndex });
    });

    this.setState({ cards: cardsTemp });
  }

  toggle() {
    this.props.toggle();
  }

  submit() {
    const { cutCardIndex, cards } = this.state;
    this.props.sendMessage({ set_result: { result: { cards, cutCardIndex } } });

    this.setState({ isSubmitSuccessfully: true });

    setTimeout(() => {
      this.setState({ isSubmitSuccessfully: false });
      this.toggle();
    }, timeoutHideMessage);
  }

  render() {
    const { isValidCutCardIndex, isValidResult, isSubmitSuccessfully } = this.state;
    const errorClasses = 'alert alert-danger';

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
                {resources.result}
              </div>
              <div><input
                className={`form-group ${isValidResult ? '' : errorClasses}`}
                type="text"
                onChange={this.handleResultChange} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col className={blockChainStyles["cut-card"]} align="center">
              <div>
                {`${resources.cutCard}`}
              </div>
              <div>
                <input
                  className={`form-group ${isValidCutCardIndex ? '' : errorClasses}`}
                  type="number"
                  min={minCutCard}
                  max={maxCardIndex}
                  onChange={this.handleCutCardChange} />
              </div>
            </Col>
          </Row>
          {isSubmitSuccessfully && <Row className={styles["errors"]}>
            <div>{resources.setResultSuccessfully}</div>
          </Row>
          }
        </ModalBody>
        {!this.props.isProduction && <ModalFooter className={styles["custom-modal-footer"]}>
          <Button
            color="primary"
            onClick={this.submit}
            disabled={!isValidResult || !isValidCutCardIndex}
            className={styles["custom-button"]}
          >
            {resources.submit}
          </Button>
        </ModalFooter>
        }
      </Modal>
    );
  }
}
