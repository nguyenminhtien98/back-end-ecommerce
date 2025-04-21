const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Tạo hoặc lấy cuộc trò chuyện
router.post('/create-or-get-chat', chatController.createOrGetChat);

// Lấy danh sách tất cả cuộc trò chuyện (chỉ admin)
router.get('/get-all-chats', chatController.getAllChats);

router.get('/get-messages/:chatId', chatController.getMessages);

module.exports = router;
