const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  userId: { type: String, default: null },
  guestId: { type: String, default: null },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
