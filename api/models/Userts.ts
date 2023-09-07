const mongoose = require('mongoose');
const Schema = mongoose.Schema;

interface GemHuntRecord {
  map: string;
  score: number;
  postedDate: Date;
}

interface MatchInfo {
  matchID: number;
  matchP1: string;
  matchP2: string;
  matchWinner: number;
  matchDate: Date;
}

interface IUser {
  username: string;
  password: string;
  ratingScore: number;
  wins: number;
  losses: number;
  streak: number;
  matchHistory: MatchInfo[];
  gemHuntRecords: GemHuntRecord[];
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ratingScore: {
    type: Number,
    default: 1000,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  matchHistory: [
    {
      matchID: String,
      matchP1: String,
      matchP2: String,
      matchWinner: { type: String, default: "Unconfirmed" },
      matchDate: Date,
    },
  ],
  gemHuntRecords: [
    {
      map: String,
      score: Number,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User
