// === ScoreX Core Types ===

export interface Player {
  id: string;
  name: string;
  totalScore: number;
  isManuallyAdjusted: boolean;
  adjustmentNote?: string;
}

export interface RoundScore {
  playerId: string;
  score: number;
}

export interface Round {
  id: string;
  roundNumber: number;
  scores: RoundScore[];
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  hostName: string;
  players: Player[];
  rounds: Round[];
  createdAt: string;
  sortDirection: "asc" | "desc";
}

export interface ScoreAdjustment {
  playerId: string;
  oldScore: number;
  newScore: number;
  note?: string;
}
