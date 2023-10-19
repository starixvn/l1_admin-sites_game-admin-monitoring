import React from "react";
import { Button, Col, Container, Modal, Row } from "reactstrap";

import BaseMonitoring, { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import styles from "./bandar-qiu-qiu.module.scss";
import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import configs from "../../../configs.json";

type HankModel = {
  name: string;
  values: Array<string>
}

class BandarQiuQiuGameModel extends BaseMonitoringState {
  roundNumber: number;
  isHandleNextRoundResult: boolean;
  gameState: number;

  hanks: Array<HankModel>;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;

    this.hanks = [
      { name: "Banker", values: ["00", "01", "02", "03"] },
      { name: "Spade", values: ["11", "12", "13", "14"] },
      { name: "Heart", values: ["22", "23", "24", "25"] },
      { name: "Club", values: ["33", "34", "35", "36"] },
      { name: "Diamond", values: ["44", "45", "46", "55"] }];
  }
}

export default class BandarQiuQiuGame extends BaseMonitoring<BandarQiuQiuGameModel, BaseMonitoringProps> {
  constructor(props) {
    super(props);
    this.state = new BandarQiuQiuGameModel();
    const bodyElement = document.body;
    bodyElement.style.background = 'none';

    this.handleChangeResult = this.handleChangeResult.bind(this);
    this.submit = this.submit.bind(this);
  }

  get totalTimeInRound(): number {
    return 39;
  }

  get waitingTime(): number {
    return 13;
  }


  handleChangeResult(id, value) {
  }

  submit() { }

  render() {
    if (this.props.isProduction) {
      return <>You are not authorized to set result</>
    }

    return (
      <div className={styles["bandar-qiu-qiu"]}>
        <h2>Bandar Qiu Qiu</h2>
        <div>
          {
            this.state.hanks.map((hank, index) => {
              return <Row className={`col-12 ${styles["margin"]}`} key={index}>
                <Col className="col-2 ">{hank.name}</Col>
                <Col className="col-4 ">
                  <input
                    value={hank.values}
                    onChange={() => this.handleChangeResult}
                  /></Col>
                <Col className="col-6 ">
                  {
                    hank.values.map((value, index) => {
                      return <img key={index} src={`${configs.RootUrl}/game-admin/images/bandar-qiu-qiu/${value}.png`} width={50} height={50}></img>
                    })
                  }
                </Col>
              </Row>
            })
          }
          <Row><Col><Button
            color="primary"
            onClick={this.submit}
            className={styles["custom-button"]}
          >
            Submit
          </Button></Col></Row>
        </div>
        {
          this.state.gameState == GameState.disabled && (
            <Notice isOpen={true} message="Game is disabled." />
          )
        }
      </div >
    );
  }
}
