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
  rageMeter: number;
  tumbles: TumbleWithMultiplier[];
}

export interface SuggestionResponse {
  rounds: SuggestionRound[];
  exampleRound: RoundInfo;
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
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
}

// Legacy interface for backward compatibility
export interface LegacyRoundInfo {
  id: string;
  reelSet: number;
  stopIndex: number[];
  tumbles: TumbleState[];
  totalWin: number;
  rageMeter: number;
}

export interface FormData {
  nickname: string;
  tumbles: Tumble[];
  multiplier: number;
  rageMeter: number;
  scatterCount: number;
}

export interface RageMeterConfig {
  thresholds: number[];
  features: string[];
}
