const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    autoReply: {
        type: Boolean,
        default: false,
    },

    userId: { type: String, default: null },

    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
}, {
    timestamps: true,
})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message