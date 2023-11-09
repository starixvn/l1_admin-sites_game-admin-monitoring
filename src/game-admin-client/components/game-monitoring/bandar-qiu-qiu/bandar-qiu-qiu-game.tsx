import React from "react";
import { Button, Col, Container, Row } from "reactstrap";

import BaseMonitoring, { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import { Notice } from "../../shared/notice/notice";
import styles from "./bandar-qiu-qiu.module.scss";
import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import configs from "../../../configs.json";
import { BandarQiuQiuResources, Dominoes } from "./bandar-qiu-qiu-constants";

function findDuplicates(input_array): any {
  const duplicates = input_array.filter((item, index) => { return input_array.indexOf(item) !== index });
  return Array.from(new Set(duplicates));
}

class HankModel {
  name: string;
  values: Array<string>;
  validedDominoes: Array<string>;
  duplicatedItems: Array<string>;

  constructor(name: string, values: Array<string>) {
    this.name = name;
    this.values = values;
    this.duplicatedItems = [];
    this.validedDominoes = [];
  }

  isValid() {
    this.validedDominoes = this.values.filter((item) => {
      return Dominoes.indexOf(item) !== -1
    })

    return this.validedDominoes.length === 4 && this.duplicatedItems.length === 0;
  }
}

class BandarQiuQiuGameModel extends BaseMonitoringState {
  roundNumber: number;
  isHandleNextRoundResult: boolean;
  gameState: number;
  isValidResult: boolean;

  hanks: Array<HankModel>;
  flatHanks: Array<string>;
  duplicatedItems: Array<string>;
  isSubmited: boolean;

  constructor() {
    super();
    this.isHandleNextRoundResult = false;
    this.gameState = 0;
    this.isValidResult = true;
    this.isSubmited = false;
    this.duplicatedItems = [];

    this.hanks = [
      new HankModel("Banker", ["00", "01", "02", "03"]),
      new HankModel("Spade", ["11", "12", "13", "14"]),
      new HankModel("Heart", ["22", "23", "24", "25"]),
      new HankModel("Club", ["33", "34", "35", "36"]),
      new HankModel("Diamond", ["44", "45", "46", "55"]),
    ];
  }
}

export default class BandarQiuQiuGame extends BaseMonitoring<BandarQiuQiuGameModel, BaseMonitoringProps> {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.state = new BandarQiuQiuGameModel();
    const bodyElement = document.body;
    bodyElement.style.background = 'none';

    this.handleChangeResult = this.handleChangeResult.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get totalTimeInRound(): number {
    return 39;
  }

  get waitingTime(): number {
    return 13;
  }


  inGameHandler({ inGame }) {
  }


  handleChangeResult(event, index: number) {
    const clonedHanks = [...this.state.hanks];
    clonedHanks[index].values = event.target.value.split(",");

    let invalidDominoes = [];
    const flatHanks = clonedHanks.reduce((accumulatedArray, hank) => {
      hank.values.forEach(item => {
        if (Dominoes.indexOf(item) === -1) {
          invalidDominoes.push(item);
        }
      })
      return accumulatedArray.concat(hank.values);
    }, []);

    const duplicates = findDuplicates(flatHanks);

    clonedHanks.forEach(hank => {
      hank.duplicatedItems = findDuplicates(hank.values.concat(duplicates));
    })

    this.setState({
      hanks: clonedHanks,
      flatHanks: flatHanks,
      duplicatedItems: duplicates,
      isValidResult: clonedHanks.every(hank => hank.isValid())
    });
  }

  handleSubmit() {
    const { roundNumber, flatHanks } = this.state;
    this.props.sendMessage({
      set_result: {
        roundId: roundNumber + 1,
        result: flatHanks,
      }
    });

    this.setState({
      isSubmited: true
    });

    setTimeout(() => {
      this.setState({
        isSubmited: false
      });
    }, 2000);
  }

  render() {
    if (this.props.isProduction) {
      return <>{BandarQiuQiuResources.unauthorized}</>
    }

    const { roundNumber, duplicatedItems, hanks, isValidResult, isSubmited, gameState } = this.state;

    return (
      <Container className={styles["bandar-qiu-qiu"]}>
        <Row className={`${styles["bold"]}`}>
          <Col> <h2>{BandarQiuQiuResources.gameName}</h2></Col>
        </Row>
        <Row className={`${styles["bold"]}`}>
          <Col >
            {BandarQiuQiuResources.nextRound} {roundNumber > 0 && `#${roundNumber + 1}`}
          </Col>
        </Row>
        {
          hanks.map((hank, index) => {
            return <Row className={`col-12 ${hank.isValid() ? "" : styles["invalid"]}`} key={index}>
              <Col className={`col-2 ${styles["bold"]}`}>{hank.name}</Col>
              <Col className="col-4 ">
                <input
                  type="text"
                  value={hank.values.join(",")}
                  onChange={(event) => { this.handleChangeResult(event, index) }}
                />
              </Col>
              <Col className="col-6 ">
                {
                  hank.values.map((value, index) => {
                    if (Dominoes.includes(value)) {
                      return <img className={`${duplicatedItems.includes(value) ? styles["duplicated"] : ""}`} key={index} src={`${configs.RootUrl}/game-admin/images/bandar-qiu-qiu/${value}.png`} width={50} height={50}></img>
                    }

                    return <span key={index}></span>;
                  })
                }
              </Col>
            </Row>
          })
        }
        <Row>
          <Col>
            <Button
              color="primary"
              disabled={gameState === GameState.waiting || !isValidResult}
              onClick={this.handleSubmit}
              className={styles["custom-button"]}
            >
              {BandarQiuQiuResources.submit}
            </Button>
          </Col>
        </Row>
        {
          isSubmited && (<Row>
            <Col className="col-10">
              <div className={`${styles["success-message"]}  text-center`} >{BandarQiuQiuResources.updateSuccessful}</div>
            </Col>
          </Row>)
        }
        {
          gameState == GameState.disabled && (
            <Notice isOpen={true} message={BandarQiuQiuResources.disabledMessage} />
          )
        }
      </Container >
    );
  }
}
