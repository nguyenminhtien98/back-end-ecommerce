// models/Chat.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chatSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
}, { timestamps: true });

module.exports = mongoose.model('InitChat', chatSchema);
