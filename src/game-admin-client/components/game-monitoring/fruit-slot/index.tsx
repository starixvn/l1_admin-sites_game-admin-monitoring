import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import BaseMonitoring, { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";
import { GameState } from "../../shared/common/GameState";
import TimeCounter from "../../shared/time-counter/time-counter";
import { fruitSlotConstant } from "./fruit-slot-constant";
import { FruitSlotDropdownlistModel, FruitSlotState } from "./fruit-slot-model";
import styles from "./fruit-slot.module.scss";
import Chance from "chance";

export default class FruitSlot extends BaseMonitoring<FruitSlotState, BaseMonitoringProps>  {
  public state: FruitSlotState;
  private extraRound: number;

  constructor(props: BaseMonitoringProps) {
    super(props);

    this.state = new FruitSlotState();
    this.extraRound = 0;

    this.handleSymbol = this.handleSymbol.bind(this);
    this.handleLuckySymbol = this.handleLuckySymbol.bind(this);
    this.handleBigSmallValueChange = this.handleBigSmallValueChange.bind(this);
    this.handleNumberOfLuckySymbolsChange = this.handleNumberOfLuckySymbolsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSymbol(symbol: string) {
    const { symbolsRender, symbols, isLucky, numberOfLuckySymbols } = this.state;

    let symbolsRenderTmp = { ...symbolsRender };
    let symbolsTmp = [];

    if (symbols.includes(symbol)) {
      symbolsTmp = symbols.filter(item => item !== symbol);
    }
    else {
      if (isLucky) {
        symbolsTmp = symbols.length >= numberOfLuckySymbols ? symbols.slice(1, numberOfLuckySymbols) : [...symbols];
      }

      symbolsTmp = symbolsTmp.concat([symbol]);
    }

    symbolsRenderTmp = { ...fruitSlotConstant.defaultSymbols };
    symbolsTmp.forEach(item => {
      symbolsRenderTmp[item] = true;
    });

    this.setState({ symbols: symbolsTmp, symbolsRender: symbolsRenderTmp });
  }

  get totalTimeInRound(): number {
    return fruitSlotConstant.totalTimeInRound;
  }

  get waitingTime(): number {
    return fruitSlotConstant.waitingTime + (this.extraRound * fruitSlotConstant.luckyRoundDuration);
  }

  handleLuckySymbol(event: React.ChangeEvent<HTMLInputElement>) {
    const isLucky = event.target.checked;

    this.setState({ isLucky });

    if (!isLucky) {
      this.resetSymbols();
    }
  }

  handleBigSmallValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value);
    const { betchoiceName } = fruitSlotConstant;
    this.setState({
      bigSmall: {
        choice: value < 8 ? betchoiceName.small : betchoiceName.big,
        value: value
      }
    });
  }

  handleNumberOfLuckySymbolsChange(event: React.ChangeEvent<HTMLInputElement>) {
    const numberOfLuckySymbols = parseInt(event.target.value);
    this.setState({ numberOfLuckySymbols });

    const { symbols } = this.state;
    if (symbols.length >= numberOfLuckySymbols) {
      this.handleSymbol(symbols[0]);
    }
  }

  resetSymbols() {
    this.setState({ symbolsRender: fruitSlotConstant.defaultSymbols, symbols: [] });
  }

  finishHandler({ finish }) {
    this.extraRound = finish.result.isLucky ? finish.result.symbols.length : 0;
    super.finishHandler({ finish });
  }

  handleSubmit() {
    const { isLucky, symbols, bigSmall } = this.state;
    const { symbolPositionsMapper } = fruitSlotConstant;

    const chance = new Chance();
    const symbolPositions: number[] = symbols.map((choice) => {
      return chance.pickone(symbolPositionsMapper[choice]);
    });

    this.props.sendMessage({
      set_result: {
        roundId: this.state.gameState == GameState.running
          ? this.state.roundNumber
          : this.state.roundNumber + 1,
        result: {
          isLucky,
          symbols,
          bigSmall,
          symbolPositions: isLucky ? [chance.pickone(symbolPositionsMapper["lucky"])].concat(symbolPositions) : symbolPositions,
        }
      }
    });

    this.setState({ isUpdateMessage: true });
    setTimeout(() => {
      this.setState({ isUpdateMessage: false });
      this.resetSymbols();
    }, 2000);

  }

  renderDropdownlist(model: FruitSlotDropdownlistModel) {
    let options = [];
    const { min, max } = model;
    for (let index = min; index <= max; index++) {
      options.push(<option value={index} key={index}>{index}</option>);
    }
    return options;
  }

  render() {
    const { roundNumber, time, isLucky, symbols, gameState, symbolsRender, isUpdateMessage } = this.state;
    const { resources } = fruitSlotConstant;

    return (
      <Container className={styles["fruit-slot"]}>
        <Row>
          <Col><h2>{resources.FruitSlot}</h2></Col>
        </Row>
        <Row>
          <Col className={styles["time-counter"]}>
            <TimeCounter
              remainingTime={time.remainingTime}
              gameState={gameState}
            ></TimeCounter>
          </Col>
        </Row>
        <Row>
          <Col>
            <label>{resources.RoundId}</label> <label className={styles["round-id"]}>{roundNumber} </label>
            <label className={styles["margin-left"]}>{isLucky}</label>
          </Col>
        </Row>
        <Row>
          <Col>
            <label>{resources.BigSmallValue} </label>
            <select
              className={styles["margin-left"]}
              onChange={(event) => this.handleBigSmallValueChange(event as any)}>
              {this.renderDropdownlist(fruitSlotConstant.bigSmall)}
            </select>
          </Col>
        </Row>
        <Row >
          <Col className={styles["lucky-symbol"]}>
            <div>
              <label>{resources.LuckySymbol}</label>
              <input
                className={styles["margin-left"]}
                type="checkbox"
                defaultChecked={isLucky}
                onChange={(event) => this.handleLuckySymbol(event)} />
            </div>
            {
              isLucky && <div className={styles["last-child"]}>
                <label>{resources.MaxSymbols}</label>
                <select
                  className={styles["margin-left"]}
                  onChange={(event) => this.handleNumberOfLuckySymbolsChange(event as any)}>
                  {this.renderDropdownlist(fruitSlotConstant.luckySymbol)}
                </select>
              </div>
            }
          </Col>
        </Row>
        <Row className={`${styles["symbol-result"]} ${isUpdateMessage ? 'alert alert-success' : ''}`}>
          <Col>
            <label>{resources.SymbolResult} </label>
            {
              symbols.map((symbol, index) => <img
                className={styles["margin-left"]}
                src={`${fruitSlotConstant.rootImageUrl}${symbol}.png`}
                alt={`${symbol}`}
                key={index}
              />)
            }
          </Col>
          <Col>
            {
              isUpdateMessage && <div>
                <span>{resources.SuccessfullyMessage}</span>
              </div>
            }
          </Col>
        </Row>
        <Row >
          <Col className={styles["symbols"]}>
            {
              Object.keys(symbolsRender).map((symbol, index) => <img
                src={`${fruitSlotConstant.rootImageUrl}${symbol === "bar" ? "bar100" : symbol}.png`}
                alt={`${symbol}`}
                key={index}
                className={`${styles["item"]} ${symbolsRender[symbol] ? styles["chosen"] : ''}`}
                onClick={() => this.handleSymbol(symbol)} />)
            }
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              className={styles["submit"]}
              onClick={this.handleSubmit}
              disabled={symbols.length === 0}>
              {resources.Submit}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
