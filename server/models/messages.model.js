const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    sender: {
        type: String,
        required: "Sender can't be empty"
    },
    receiver: {
        type: String,
        required: "Receiver can't be empty"
    },
    body: {
        type: String
    },
    important: {
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const msgModel = mongoose.model('messages', msgSchema);

module.exports = { msg: msgModel }