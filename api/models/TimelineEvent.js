var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TimelineEventModel = {
    date: {
        type: Date,
        required: true,
    },
    playerName: {
        type: String,
        required: false,
    },
    map: {
        type: String,
        required: false,
    },
    score: {
        type: Number,
        required: false,
    },
    previousRecord: {
        type: Number,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },

};

const TimelineEventSchema = new Schema(TimelineEventModel)
const TimelineEvent = mongoose.model("timeline-event", TimelineEventSchema);
module.exports = TimelineEvent;
