import CardResult from "../../common/model/CardResult";
import Baccarat from "../baccarat";

export default class BaccaratMultiplayer extends Baccarat {
    get gameName() {
        return "Baccarat Multiplayer";
    }

    updaterSubmit(result) {
        const obj = {
          [this.setResultObjectKey]: {
            result: {
              banker: result.banker,
              player: result.player,
            },
            roundId: this.state.roundNumber,
          },
        };
    
        this.setState({
          result: {
            playerCards: result.player,
            bankerCards: result.banker,
          },
          isShowResultUpdater: false,
        });
        this.props.sendMessage(obj);
      }
    
      onPickCard(card: number, type: number) {
        const { result, selectedCard, cardIndex } = this.state;
        let cardResult = new CardResult();
        cardResult.card = card;
        cardResult.type = type;
        result[selectedCard][cardIndex] = cardResult;
        this.setState({
          result: result,
          isShowDeskOfCards: false,
        });
    
        const message = {
          [this.setResultObjectKey]: {
            result: {
              banker: result.bankerCards,
              player: result.playerCards,
            },
            roundId: this.state.roundNumber,
          },
        };
    
        this.props.sendMessage(message);
      }
}