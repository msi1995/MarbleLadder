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
    matchP2: {
        type: String,
        required: true,
    },
    matchP2Name: {
        type: String,
        required: true,
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
