import { PlayerColor } from "./enums";

export function convertBoard(board: {
  [player in string]: number[];
}) {
  const raceMap: { [cellNumber: number]: PlayerColor } = {};
  const stableMap: { [color in PlayerColor]?: number[] } = {
    [PlayerColor.ZERO]: [],
    [PlayerColor.ONE]: [],
    [PlayerColor.TWO]: [],
    [PlayerColor.THREE]: [],
  };
  const startingAreaMap: { [color in PlayerColor]?: number } = {
    [PlayerColor.ZERO]: 0,
    [PlayerColor.ONE]: 0,
    [PlayerColor.TWO]: 0,
    [PlayerColor.THREE]: 0,
  };
  for (const player in board) {
    const playerColor = parseInt(player) as PlayerColor;
    for (const position of board[player]) {
      if (position === 0) {
        startingAreaMap[playerColor] = (startingAreaMap[playerColor] || 0) + 1;
      } else if (position < 57) {
        raceMap[position] = playerColor;
      } else {
        stableMap[playerColor]?.push(position);
      }
    }
  }
  return { raceMap, stableMap, startingAreaMap };
}
