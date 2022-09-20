import React from "react";
import configs from "../../../configs.json";

type Props = {
};

type State = {
  roundId: number;
  bigSmallValue: number;
  isLuckySymbol: boolean;
  choicesResult: Array<string>;
};

const symbols = {
  bar: "bar",
  bar25: "bar25",
  bar50: "bar50",
  tripleSeven: "tripleSeven",
  tripleSeven3: "tripleSeven3",
  watermelon: "watermelon",
  watermelon3: "watermelon3",
  star: "star",
  star3: "star3",
  bell: "bell",
  bell3: "bell3",
  orange: "orange",
  orange3: "orange3",
  lemon: "lemon",
  lemon3: "lemon3",
  cherry: "cherry",
  cherry3: "cherry3"
};

const maxLuckySymbol = 2;

export default class FruitSlot extends React.Component<Props, State> {
  public state: State;
  constructor(props: Props) {
    super(props);

    this.state = {
      roundId: 1,
      bigSmallValue: 8,
      isLuckySymbol: false,
      choicesResult: []
    };

    this.handleSymbol = this.handleSymbol.bind(this);
    this.handleLuckySymbol = this.handleLuckySymbol.bind(this);
    this.handleBigSmallValueChange = this.handleBigSmallValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSymbol(event, symbol: string) {
    const { choicesResult, isLuckySymbol } = this.state;
    if (isLuckySymbol && choicesResult.length > maxLuckySymbol) {
      alert('Max lucky symbol');
      return;
    }

    let results = isLuckySymbol ? [...choicesResult].concat([symbol]) : [symbol];

    this.setState({ choicesResult: results });

    console.log('handleSymbol');
  }

  handleLuckySymbol(event) {
    console.log('handleLuckySymbol');
    this.setState(prevState => ({ isLuckySymbol: !prevState.isLuckySymbol }));
  }

  handleBigSmallValueChange(event) {
    console.log('handleBigSmallValueChange:' + event.target.value);
    this.setState({ bigSmallValue: event.target.value });
  }

  handleSubmit(event) {
    console.log('handleSubmit');
    console.log(this.state);
  }

  render() {
    let dropdownlist = [];
    for (let i = 1; i <= 16; i++) {
      dropdownlist.push(<option value={i} key={i} >{i}</option>);
    }

    let symbolsElement = Object.values(symbols).map((symbol, index) => {
      return <img
        src={`${configs.RootUrl}/game-admin/images/fruitslot/${symbol}.png`}
        alt={`${symbol}`}
        key={index} style={{ marginLeft: "10px", cursor: "pointer" }}
        onClick={(event) => this.handleSymbol(event, symbol)} />;
    });


    return (
      <div style={{ background: "white", marginTop: "200px", paddingLeft: "20px" }}>
        <h2>Fruit Slot</h2>
        <div>
          <label>RoundId:</label>
          <label style={{ marginLeft: "10px" }}>{this.state.roundId}</label>
        </div>
        <div>
          <label>Big Small Result</label>
          <select style={{ marginLeft: "10px" }} onChange={(event) => this.handleBigSmallValueChange(event)}>
            {dropdownlist}
          </select>
        </div>
        <div>
          <label>Symbol Result:</label>
          <input
            style={{ marginLeft: "10px" }}
            type="checkbox"
            defaultChecked={this.state.isLuckySymbol}
            onChange={(event) => this.handleLuckySymbol(event)} />
        </div>
        <div >
          {symbolsElement}
        </div>
        <div>
          <input
            style={{ float: "right", marginRight: "50px" }}
            type="submit"
            value={"Submit"}
            onClick={(event) => this.handleSubmit(event)} />
        </div>
      </div>
    );
  }
}
