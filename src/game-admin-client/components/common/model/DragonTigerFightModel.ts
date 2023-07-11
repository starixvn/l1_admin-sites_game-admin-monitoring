import BetList from "./BetList";
import { DragonTigerBetList } from "./DragonTigerModel";

export class DragonTigerFightBetList extends DragonTigerBetList {
  blackDragon: BetList;
  redDragon: BetList;
  blackTiger: BetList;
  redTiger: BetList;

  constructor() {
    super();

    this.blackDragon = new BetList();
    this.redDragon = new BetList();
    this.blackTiger = new BetList();
    this.redTiger = new BetList();
  }
}
