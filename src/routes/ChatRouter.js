const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');

router.post('/create-or-get-chat', chatController.createOrGetChat);
router.get('/get-all-chats', chatController.getAllChats);
router.get('/get-messages/:chatId', chatController.getMessages);
router.post('/merge-guest', chatController.mergeGuestConversation);

module.exports = router;
