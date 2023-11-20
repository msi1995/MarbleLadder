var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gemHuntMapRecordModel = {
    mapName: {
        type: String,
    },
    worldRecord: {
        type: Number
    },
    scores: [
        {
            runID: String,
            player: String,
            score: Number,
            media: String,
            description: String,
            verified: Boolean,
            verifiedBy: String,
            denied: Boolean,
            date: Date,
        },
    ],
}

const gemHuntMapRecordSchema = new Schema(gemHuntMapRecordModel)
const gemHuntMapRecord = mongoose.model("gemHuntMapRecord", gemHuntMapRecordSchema);
module.exports = gemHuntMapRecord;
