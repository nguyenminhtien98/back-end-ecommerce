const MessageService = require('../services/MessageService');
const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/initChatModel'); 

/**
 * Gửi tin nhắn từ người dùng hoặc admin
 */
// Gửi tin nhắn từ người dùng hoặc admin
const sendMessage = async (req, res) => {
    try {
        const { chatId, sender, content, userId } = req.body;

        // Gửi tin nhắn thông qua MessageService
        const message = await MessageService.sendMessage(chatId, sender, content, userId);

        return res.status(200).json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Có lỗi khi gửi tin nhắn' });
    }
};

/**
 * Lấy tất cả tin nhắn trong một cuộc trò chuyện
 */
const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({ message: 'Missing chatId' });
        }

        const messages = await MessageService.getMessagesByChatId(chatId);
        
        if (!messages) {
            return res.status(404).json({ message: 'No messages found for this chat' });
        }

        // Đảm bảo trả về mảng, ngay cả khi không có tin nhắn
        return res.status(200).json(messages || []);
    } catch (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ message: 'Error fetching messages', error: err.message });
    }
};

/**
 * Xử lý trả lời tự động cho người dùng dựa trên câu hỏi
 */
const autoReplyMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        if (!chatId || !content) {
            return res.status(400).json({ status: 'ERR', message: 'Missing chatId or content' });
        }
        const response = await MessageService.autoReplyMessage({ chatId, content });
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message });
    }
};

/**
 * Lấy danh sách các tin nhắn từ admin hoặc user (dùng cho admin để xem tin nhắn)
 */
const getChatMessagesForAdmin = async (req, res) => {
    try {
        const { chatId } = req.params;
        const response = await MessageService.getChatMessagesForAdmin(chatId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message });
    }
};

/**
 * Admin gửi tin nhắn phản hồi
 */
const adminSendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const sender = 'admin';
        if (!chatId || !content) {
            return res.status(400).json({ status: 'ERR', message: 'Missing chatId or content' });
        }
        const response = await MessageService.sendMessage({ chatId, sender, content });
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message });
    }
};

// INIT CHAT - guest hoặc user đều dùng
const initChat = async (req, res) => {
    try {
      const newChat = new Chat();
      await newChat.save();
  
      res.status(201).json({ chatId: newChat._id });
    } catch (error) {
      console.error('initChat error:', error);
      res.status(500).json({ error: 'Failed to initialize chat' });
    }
  };

module.exports = {
    sendMessage,
    getMessages,
    autoReplyMessage,
    getChatMessagesForAdmin,
    adminSendMessage,
    initChat
};