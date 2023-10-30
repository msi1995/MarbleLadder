var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passwordResetRequestModel = {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    }
};

const passwordResetRequestSchema = new Schema(passwordResetRequestModel)
const passwordResetRequest = mongoose.model("passwordResetRequest", passwordResetRequestSchema);
module.exports = passwordResetRequest;
