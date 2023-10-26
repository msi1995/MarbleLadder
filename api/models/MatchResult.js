var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;

var matchResultModel = {
    traceID: {
        type: String,
        required: true,
    },
    matchP1: {
        type: String,
        required: true,
    },
    matchP1Name: {
        type: String,
    },
    matchP1Rating: {
        type: Number,
    },
    matchP2: {
        type: String,
        required: true,
    },
    matchP2Name: {
        type: String,
        required: true,
    },
    matchP2Rating: {
        type: Number
    },
    P1Score: {
        type: Number,
        required: false,
    },
    P2Score: {
        type: Number,
        required: false,
    },
    matchWinner: {
        type: String,
        required: true,
    },
    matchWinnerName: {
        type: String,
        required: true,
    },
    matchWinnerELOChange: {
        type: Number,
        required: false,
    },
    matchLoserELOChange: {
        type: Number,
        required: false,
    },
    matchDate: {
        type: Date,
        required: true,
    },
    confirmed: {
        type: Boolean,
        required: true,
    },
    disputed: {
        type: Boolean,
        required: true,
    },
    map: {
        type: String,
        required: false,
    },
}

const matchResultSchema = new Schema(matchResultModel)
const matchResult = mongoose.model("matchResult", matchResultSchema);
module.exports = matchResult;
