const ChatService = require('../services/ChatService')

const createOrGetChat = async (req, res) => {
    try {
        const { userId, guestId } = req.body
        if (!userId && !guestId) {
            return res.status(400).json({ status: 'ERR', message: 'Missing userId or guestId' })
        }
        const response = await ChatService.createOrGetChat({ userId, guestId })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { chatId, sender, content } = req.body
        if (!chatId || !sender || !content) {
            return res.status(400).json({ status: 'ERR', message: 'Missing required fields' })
        }
        const response = await ChatService.sendMessage({ chatId, sender, content })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message })
    }
}

/**
 * Lấy tất cả tin nhắn trong một cuộc trò chuyện
 */
const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params
        const response = await ChatService.getMessages(chatId)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message })
    }
}

/**
 * Lấy danh sách tất cả cuộc trò chuyện (chỉ admin)
 */
const getAllChats = async (req, res) => {
    try {
        const response = await ChatService.getAllChats();
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
        const { chatId, content } = req.body
        const sender = 'admin'
        if (!chatId || !content) {
            return res.status(400).json({ status: 'ERR', message: 'Missing chatId or content' })
        }
        const response = await ChatService.sendMessage({ chatId, sender, content })
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ status: 'ERR', message: err.message })
    }
}

const mergeGuestConversation = async (req, res) => {
    try {
        const { guestChatId, userId } = req.body;

        if (!guestChatId || !userId) {
            return res.status(400).json({ status: "ERR", message: "Missing guestChatId or userId" });
        }

        const mergedChat = await ChatService.mergeGuestChat(guestChatId, userId);

        if (!mergedChat) {
            return res.status(404).json({ status: "ERR", message: "Guest chat not found or merge failed" });
        }

        return res.status(200).json({ status: "OK", message: "Chat merged successfully", conversation: mergedChat });
    } catch (error) {
        console.error("Error merging guest conversation:", error);
        return res.status(500).json({ status: "ERR", message: "Internal server error" });
    }
}

module.exports = {
    createOrGetChat,
    sendMessage,
    getMessages,
    getAllChats,
    adminSendMessage,
    mergeGuestConversation
}
