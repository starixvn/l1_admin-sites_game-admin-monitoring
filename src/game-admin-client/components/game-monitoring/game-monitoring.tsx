import _ from "lodash";

import { gameMapper, getGameName } from "../../constants/game-mapper-constant";

export function getGameInfoByGameId(gameId: number | string) {
  return gameMapper[gameId];
}

export function getGameInfoByGameName(gameName: string) {
  return gameMapper[getGameName(gameName)];
}

export type GameMonitoringInfo = {
  component: any;
  selector: (message: any) => boolean;
  onMessage: (callback: (message: any) => any) => Function;
  initialMessage: object;
  endMessage: object;
  generateMessage: (data: any) => object;
};
