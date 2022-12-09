import React from "react";
import styles from "../baccarat/baccarat-result-updater.module.scss";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";
import {
  generateResult,
  Win3CardsSettlementResult,
} from "./generate-win-3-cards-result";

type Props = {
  modal: boolean;
  toggle: Function;
  submit: Function;
  isMini?: boolean;
};

type State = {
  modal: boolean;
  errors: string;
  types: Array<OptionType>;
};

type OptionType = {
  name: string;
  displayName: string;
  value: boolean;
};

const CHOICES = [
  { name: "dragon", displayName: "Dragon" },
  { name: "phoenix", displayName: "Phoenix" },
  { name: "pair8Plus", displayName: "Pair 8 Plus" },
  { name: "threeOfAKind", displayName: "Three of a Kind" },
  { name: "straightFlush", displayName: "Straight Flush" },
  { name: "flush", displayName: "Flush" },
  { name: "straight", displayName: "Straight" },
  { name: "killer235", displayName: "235" },
];

export default class Win3CardsResultUpdater extends React.Component<
  Props,
  State
> {
  constructor(props: any) {
    super(props);

    this.state = {
      modal: false,
      errors: "",
      types: CHOICES.map((choice) => {
        return {
          name: choice.name,
          displayName: choice.displayName,
          value: false,
        };
      }),
    };

    this.toggle = this.toggle.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.submit = this.submit.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  submit() {
    const choices = this.getCheckedTypes();
    if (Object.values(choices).filter((x) => x == true).length < 1) {
      this.setState({ errors: "You must choose values." });
    } else {
      this.props.submit(generateResult(choices as Win3CardsSettlementResult));
    }
  }

  handleCheck(type, e) {
    const types = [...this.state.types];
    const updateType = types.find((t) => t.name === type.name);
    updateType.value = e.target.checked;
    this.setState({
      types: types,
      errors: "",
    });
  }

  getCheckedTypes() {
    const result = this.state.types.reduce((result, type: OptionType) => {
      result[type.name] = type.value;
      return result;
    }, {});

    return result;
  }

  renderType(type: OptionType, index) {
    return (
      <div className={styles["check-block"]} key={index}>
        <div>{type.displayName}</div>
        <div>
          <input
            type="checkbox"
            checked={type.value}
            onChange={(e) => this.handleCheck(type, e)}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modal}
          toggle={this.toggle}
          className={styles["result-updater"]}
        >
          <ModalHeader
            className={styles["custom-modal-header"]}
            toggle={this.toggle}
          ></ModalHeader>
          <ModalBody className={styles["modal-content"]}>
            <Row className={styles["row"]}>
              {this.state.types.map((type, index) =>
                this.renderType(type, index)
              )}
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
      </div>
    );
  }
}
