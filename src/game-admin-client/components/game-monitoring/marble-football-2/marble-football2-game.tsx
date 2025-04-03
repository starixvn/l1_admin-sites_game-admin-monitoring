import {
  MarbleFootball2Constant,
  MarbleFootball2Resources,
} from "./marble-football2-constants";
import MarbleFootballGame from "../marble-football/marble-football-game";
import { BaseMonitoringProps } from "../../shared/base-monitoring/base-monitoring";

export default class MarbleFootball2Game extends MarbleFootballGame {
  constructor(props: BaseMonitoringProps) {
    super(props);
    this.constant = MarbleFootball2Constant;
    this.resources = MarbleFootball2Resources;
  }
}
