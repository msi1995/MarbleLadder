var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;
var ladderPlayerModel = {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    ratingScore: {
        type: Number,
        required: false,
        default: 1000,
    },
    wins: {
        type: Number,
        required: false,
        default: 0,
    },
    losses: {
        type: Number,
        required: false,
        default: 0,
    },
    currentStreak: {
        type: Number,
        required: false,
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
    createdAt:{
        type: Date
    }
};

const ladderPlayerSchema = new Schema(ladderPlayerModel)
ladderPlayerSchema.plugin(uniqueValidator);
const ladderPlayer = mongoose.model("ladderPlayer", ladderPlayerSchema);
module.exports = ladderPlayer;
