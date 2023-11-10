var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gemHuntMapRecordModel = {
    mapName: {
        type: String,
    },
    scores: [
        {
            runID: String,
            player: String,
            score: Number,
            media: String,
            verified: Boolean,
            date: Date,
        },
    ],
}

const gemHuntMapRecordSchema = new Schema(gemHuntMapRecordModel)
const gemHuntMapRecord = mongoose.model("gemHuntMapRecord", gemHuntMapRecordSchema);
module.exports = gemHuntMapRecord;
