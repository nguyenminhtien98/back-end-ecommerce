const MessageService = require('../services/MessageService');
const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/ChatModel');

const sendMessage = async (req, res) => {
    try {
        const { chatId, sender, content, userId } = req.body;

        const message = await MessageService.sendMessage({ chatId, sender, content, userId });
        const io = req.app.get('io');
        if (io) {
            console.log("Đang phát sự kiện receive-message:", message);
            io.to(chatId).emit('receive-message', message);
        }

        return res.status(200).json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Có lỗi khi gửi tin nhắn' });
    }
};

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

        return res.status(200).json(messages || []);
    } catch (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ message: 'Error fetching messages', error: err.message });
    }
};

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

const getChatMessagesForAdmin = async (req, res) => {
    try {
        const { chatId } = req.params;
        const response = await MessageService.getChatMessagesForAdmin(chatId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message });
    }
};


const adminSendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const sender = 'admin';
        if (!chatId || !content) {
            return res.status(400).json({ status: 'ERR', message: 'Missing chatId or content' });
        }

        const response = await MessageService.sendMessage({ chatId, sender, content });

        const io = req.app.get('io');
        if (io) {
            console.log("Phát sự kiện receive-message:", response);
            io.to(chatId).emit('receive-message', response);
        }

        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message });
    }
}
const initChat = async (req, res) => {
    try {
      // Lấy guestId từ body; nếu không có thì cảnh báo.
      const { guestId } = req.body;  
      if (!guestId) {
        return res.status(400).json({ error: 'Missing guestId' });
      }
      // Tạo mới Chat với guestId được truyền vào. Schema của Chat sẽ tự động lưu userId là null.
      const newChat = new Chat({ guestId: guestId });
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