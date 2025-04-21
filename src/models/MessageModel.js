const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    sender: {
        type: String, // 'user' hoặc 'admin'
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
        default: false, // Đánh dấu nếu tin nhắn là tự động trả lời từ admin
    },
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User', // Liên kết đến model User (nếu người dùng đã đăng nhập)
    //     default: null, // Nếu người dùng chưa đăng nhập, để null hoặc giá trị tạm thời
    // },
    userId: { type: String, default: null },
    // chatId: {
    //     type: String,
    //     ref: 'Chat', // Liên kết đến model Chat (nếu có)
    //     required: true,
    // },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    // chatId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Chat',
    //     required: true
    //   }
}, {
    timestamps: true,
})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message