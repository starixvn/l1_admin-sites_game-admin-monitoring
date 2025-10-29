// Core data structures for the cluster slot game

export interface ClusterWin {
  symbol: number;
  size: number;
}

export interface Tumble {
  clusterWin: ClusterWin[];
}

export interface TumbleWithMultiplier {
  clusterWin: (ClusterWin & { multiplier: number })[];
}

export interface SuggestionRound {
  roundInfoId: string;
  isFreeSpin: boolean;
  rageMeter: number;
  tumbles: TumbleWithMultiplier[];
  roundId?: string;
  buyFreeSpinMode?: number;
}

export interface SuggestionResponse {
  rounds: SuggestionRound[];
  exampleRound: RoundInfo;
  exampleFreeSpinRoundGroup?: FreeSpinGroup;
}

export interface Position {
  x: number;
  y: number;
}

export interface ClusterWinResult {
  symbol: number;
  position: Position[];
  multiplier: number;
}

export interface DetonateReason {
  clusterWin: ClusterWinResult[];
  featureTriggerGrids: Position[];
  featureType?: number;
}

export interface CurrentState {
  board: number[][];
  multiplier: number[][];
  rageMeter: number;
}

export interface TumbleState {
  currentState: CurrentState;
  detonateReason: DetonateReason;
}

// New structure for the updated API data
export interface SymbolWin {
  symbol: number;
  position: Position[];
  count: number;
  multiplier: number;
  odds: number;
  win: number;
}

export interface TumbleData {
  reels: number[][];
  reelMultipliers: number[][];
  symbols: SymbolWin[];
  win: number;
  rageMeter: number;
  triggeredPositions?: Position[];
  newSymbols?: number[][];
  triggeredStage?: number;
}

export interface RoundInfo {
  id: string;
  reelSet: number;
  stopIndex: number[];
  tumbles: TumbleData[];
  totalWin: number;
  rageMeter: number;
  scatterCount: number;
}

export interface FreeSpinGroup {
  rootRound: RoundInfo;
  freeSpinRounds: (RoundInfo & { order: number })[];
}

export interface FormData {
  nickname: string;
  tumbles: Tumble[];
  multiplier: number;
  rageMeter: number;
  scatterCount: number;
  isFreeSpin: boolean;
  fromBuyFreeSpin: boolean;
  fromBuySuperFreeSpin: boolean;
}

export interface RageMeterConfig {
  thresholds: number[];
  features: string[];
}
