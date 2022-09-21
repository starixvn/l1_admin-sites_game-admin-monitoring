import React from "react";
import { Col, Container, Row } from "reactstrap";
import configs from "../../../configs.json";
import BaseMonitoringState from "../../common/model/BaseMonitoringModel";
import TimeModel from "../../common/model/TimeModel";
import BaseMonitoring, { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import RoundNum from "../../shared/round-num/round-num";
import TimeCounter from "../../shared/time-counter/time-counter";
import styles from "./fruit-slot.module.scss";

const fruitSlotConstant = {
  maxLuckySymbol: 2,
  bigSmall: {
    min: 1,
    max: 16
  },
  defaultSymbols: {
    bar: false,
    bar25: false,
    bar50: false,
    tripleSeven: false,
    tripleSeven3: false,
    watermelon: false,
    watermelon3: false,
    star: false,
    star3: false,
    bell: false,
    bell3: false,
    orange: false,
    orange3: false,
    lemon: false,
    lemon3: false,
    cherry: false,
    cherry3: false
  }
};

class FruitSlotState extends BaseMonitoringState {
  roundNumber: number;
  time: TimeModel;
  gameState: number;
  symbolsRender: any;
  isLucky: boolean;
  symbols: Array<string>;
  bigSmall: number;

  constructor() {
    super();
    this.time = new TimeModel();
    this.gameState = 0;
    this.symbols = [];
    this.symbolsRender = { ...fruitSlotConstant.defaultSymbols };
  }
}

export default class FruitSlot extends BaseMonitoring<FruitSlotState, BaseMonitoringProps>  {
  public state: FruitSlotState;
  constructor(props: BaseMonitoringProps) {
    super(props);

    this.state = new FruitSlotState();

    this.handleSymbol = this.handleSymbol.bind(this);
    this.handleLuckySymbol = this.handleLuckySymbol.bind(this);
    this.handleBigSmallValueChange = this.handleBigSmallValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSymbol(event, symbol: string) {
    const { symbolsRender, symbols, isLucky } = this.state;

    let symbolsRenderTmp = { ...symbolsRender };

    if (symbolsRender[symbol]) {
      symbolsRenderTmp[symbol] = !symbolsRender[symbol];
    }
    else {
      if (isLucky) {
        if (symbols.length > fruitSlotConstant.maxLuckySymbol) {
          symbolsRenderTmp[symbols[0]] = false;
        }
      }
      else {
        symbolsRenderTmp = { ...fruitSlotConstant.defaultSymbols };
      }
      symbolsRenderTmp[symbol] = true;
    }

    this.setState({ symbols: Object.keys(symbolsRender).filter((symbol) => symbolsRenderTmp[symbol]), symbolsRender: symbolsRenderTmp });
  }

  get totalTimeInRound(): number {
    return 30;
  }

  get waitingTime(): number {
    return 12;
  }

  handleLuckySymbol(event) {
    const isLucky = event.target.checked;
    this.setState({ isLucky });

    if (!isLucky) {
      this.setState({ symbolsRender: fruitSlotConstant.defaultSymbols, symbols: [] });
    }
  }

  handleBigSmallValueChange(event) {
    this.setState({ bigSmall: parseInt(event.target.value) });
  }

  handleSubmit(event) {
    const { isLucky, symbols, bigSmall } = this.state;
    console.log(this.state);

    this.props.sendMessage({
      set_result: {
        roundId: this.state.gameState == GameState.running
          ? this.state.roundNumber
          : this.state.roundNumber + 1,
        result: { isLucky, symbols, bigSmall }
      }
    });
  }

  render() {
    const { roundNumber, time, isLucky, symbols, gameState, symbolsRender } = this.state;

    let dropdownlist = [];
    const { min, max } = fruitSlotConstant.bigSmall;
    for (let i = min; i <= max; i++) {
      dropdownlist.push(<option value={i} key={i} >{i}</option>);
    }

    return (
      <Container className={styles["fruit-slot"]} style={{ background: "white", marginTop: "200px", paddingLeft: "20px" }}>
        <Row>
          <Col className={styles.timecounter}>
            <div className={styles.title}>Fish Prawn Crab</div>
            <TimeCounter
              remainingTime={time.remainingTime}
              gameState={gameState}
            ></TimeCounter>
            {/* <RoundNum roundNumber={roundNumber} /> */}
          </Col>
          <Col> Fruit Slot</Col></Row>
        <Row>
          <Col>
            <label>RoundId: {roundNumber} </label>
            <label style={{ marginLeft: "10px" }}>{isLucky}</label>
          </Col>

        </Row>
        <Row>
          <Col>  <label>Big Small Result</label>
            <select style={{ marginLeft: "10px" }} onChange={(event) => this.handleBigSmallValueChange(event)}>
              {dropdownlist}
            </select>
          </Col>
        </Row>
        <Row style={{ lineHeight: "70px" }}>
          <Col>
            <label>Symbol Result:</label>
            {
              symbols.map((symbol, index) => <img
                src={`${configs.RootUrl}/game-admin/images/fruitslot/${symbol}.png`}
                alt={`${symbol}`}
                key={index}
                style={{ marginLeft: "10px" }}
              />)
            }
          </Col>
          <Col>
            <input
              style={{ marginLeft: "10px" }}
              type="checkbox"
              defaultChecked={isLucky}
              onChange={(event) => this.handleLuckySymbol(event)} /> Lucky Symbol
          </Col>
        </Row>
        <Row >
          <Col style={{ border: "1px solid black", marginRight: "10px" }}>
            {
              Object.keys(symbolsRender).map((symbol, index) => <img
                src={`${configs.RootUrl}/game-admin/images/fruitslot/${symbol}.png`}
                alt={`${symbol}`}
                key={index}
                style={{ marginLeft: "10px", cursor: "pointer", border: `2px solid ${symbolsRender[symbol] ? 'red' : 'white'}` }}
                onClick={(event) => this.handleSymbol(event, symbol)} />)
            }
          </Col>
        </Row>
        <Row>
          <Col>
            <input
              style={{ float: "right", marginRight: "50px" }}
              type="submit"
              value={"Submit"}
              onClick={(event) => this.handleSubmit(event)} />
          </Col>
        </Row>
      </Container>
    );
  }
}
