const ChatService = require('../services/ChatService')

/**
 * Tạo hoặc lấy cuộc trò chuyện theo userId (nếu đã đăng nhập)
 * hoặc guestId (nếu chưa đăng nhập - frontend gửi tạm mã định danh local)
 */
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
      return res.status(200).json(response);  // Trả về danh sách cuộc trò chuyện với các tin nhắn
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

module.exports = {
    createOrGetChat,
    sendMessage,
    getMessages,
    getAllChats,
    adminSendMessage,
}
