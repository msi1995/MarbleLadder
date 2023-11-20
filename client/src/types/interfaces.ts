export interface LadderPlayer {
  admin: boolean;
  email: string;
  isVerified: boolean;
  password: string 
  username: string
  ratingScore: number;
  peakRatingScore: number;
  wins: number;
  losses: number;
  currentStreak: number;
  matchHistory: { traceID: string }[];
  gemHuntRecords: {
    runID: string;
    map: string;
    score: number;
    mediaLink: string;
    date: Date;
    verified: boolean;
  }[];
  matchCount: number;
  disputes: { traceID: string }[];
  createdAt: Date;
  rank?: number;
  key: string;
}

export interface matchResult {
  traceID: string;
  matchP1: string;
  matchP1Name: string;
  matchP1Rating: number;
  matchP2: string;
  matchP2Name: string;
  matchP2Rating: number;
  P1Score: number;
  P2Score: number;
  matchWinner: string;
  matchWinnerName: string;
  matchWinnerELOChange: number;
  matchLoserELOChange: number;
  matchDate: Date;
  confirmed: boolean;
  disputed: boolean;
  map: string;
  replays: [
    {
      submitter: string;
      URL: string;
    }
  ];
}
export interface GemHuntMapRecordScore {
  runID: string;
  player: string;
  score: number;
  totalScore?: number;
  bestScoresByMap?: Record<string, number>;
  media: string;
  description: string;
  verified: boolean;
  verifiedBy: string;
  denied: boolean;
  date: Date;
}
export interface GemHuntMapRecordScoreWithMap extends GemHuntMapRecordScore {
  map: string;
}

export interface GemHuntMapRecord {
  mapName: string;
  worldRecord: number;
  scores: GemHuntMapRecordScore[];
}

export interface PlayerTotalScoreObject {
  player: string;
  totalScore: number;
  bestScoresByMap: Record<string, number>;
}

export interface OpponentDropdownData {
  name: string;
  value: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}