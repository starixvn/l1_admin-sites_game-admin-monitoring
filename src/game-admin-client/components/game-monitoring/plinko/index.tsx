import React from "react";

import PlinkoModel from "../../common/model/PlinkoModel";
import BaseMonitoring, {
  BaseMonitoringProps,
} from "../../shared/base-monitoring/base-monitoring";
import { Constant, Resources } from "./plinko-constants";
import { Button, Col, Container, Row } from "reactstrap";
import styles from "./plinko.module.scss";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";

export default class Plinko extends BaseMonitoring<
  PlinkoModel,
  BaseMonitoringProps
> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new PlinkoModel();
    const bodyElement = document.body;
    bodyElement.style.background = "none";

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  inGameHandler({ inGame }) {}


  handleSubmit() {
    const { nickname, choice } = this.state;

    if (!this.validateSlotIndex(choice)) {
      return;
    }

    this.props.sendMessage({
      set_result: {
        playerName: nickname,
        result: {
          playerName: nickname,
          result: this.handleMapIndexToPath(choice)},
      },
    });

    this.setState({
      isSubmited: true,
    });

    setTimeout(() => {
      this.setState({
        isSubmited: false,
      });
    }, Constant.showedSucceedMessegeTimebyMillisecond);
  }

  handleMapIndexToPath(index: string) {
    const indexNum = parseInt(index);
    
    const result = new Array(16).fill(0);
    
    for (let i = 0; i < indexNum; i++) {
      result[i] = 1;
    }
    
    return result;
  }

  validateSlotIndex(index: string): boolean {
    const indexNum = parseInt(index);
    if (isNaN(indexNum) || indexNum < 0 || indexNum > 16) {
      this.setState({
        errorMessage: "Slot index must be between 0 and 16"
      });
      return false;
    }
    this.setState({
      errorMessage: ""
    });
    return true;
  }

  render() {
    if (this.props.isProduction) {
      return <>{Resources.unauthorized}</>;
    }

    const {
      isSubmited,
      gameState,  
      choice,
      nickname,
      errorMessage,
    } = this.state;

    return (
      <Container className={styles["cointoss"]}>
        <Row>
          <Col className={`${styles["bold"]}`}>
            {" "}
            <h2>{Resources.gameName}</h2>
          </Col>
        </Row>

        <Row className={``}>
          <Col className="col-1">
            {" "}
            <label>Nickname</label>
          </Col>
          <Col className="col-2">
            <input
              className="form-control"
              name="nickname"
              type="text"
              value={nickname}
              onChange={(event) => {
                this.setState({ nickname: event.target.value });
              }}
              placeholder="Nickname"
            />
          </Col>
        </Row>
        <Row className={``}>
          <Col className="col-1">
            <label>Result</label>
          </Col>
          <Col className="col-2">
            <input
              className="form-control"
              name="choice"
              type="text"
              value={choice}
              onChange={(event) => {
                this.setState({ choice: event.target.value });
                this.validateSlotIndex(event.target.value);
              }}
              placeholder="Slot Index (0-16)"
            />
          </Col>
        </Row>
        {errorMessage && (
          <Row>
            <Col className="col-10">
              <div className={`${styles["error-message"]} text-center text-danger`}>
                {errorMessage}
              </div>
            </Col>
          </Row>
        )}
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
      </Container>
    );
  }
}
