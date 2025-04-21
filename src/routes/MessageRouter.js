const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Gửi tin nhắn (user hoặc guest gửi tin nhắn)
router.post('/send-message', messageController.sendMessage);

// Lấy tất cả tin nhắn trong một cuộc trò chuyện
router.get('/get-messages/:chatId', messageController.getMessages);
router.post('/init-chat', messageController.initChat);

module.exports = router;
