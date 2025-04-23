const Message = require('../models/MessageModel');
const Chat = require('../models/ChatModel');

const createMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    const savedMessage = await message.save();
    return savedMessage;
  } catch (err) {
    throw err;
  }
};

const getAutoReply = (text) => {
  const autoReplies = {
    "mở cửa": "Shop mở cửa từ 9:00 sáng đến 6:00 chiều mỗi ngày.",
    "ship toàn quốc": "Chúng tôi có dịch vụ ship toàn quốc, bạn có thể đặt hàng trực tuyến và nhận hàng ở bất kỳ đâu.",
    "đổi trả": "Chính sách đổi trả của chúng tôi trong vòng 7 ngày kể từ ngày nhận hàng.",
    "phí vận chuyển": "Phí vận chuyển sẽ tùy thuộc vào khu vực và trọng lượng đơn hàng.",
    "size cho trẻ em": "Chúng tôi có các size dành cho trẻ em, bạn có thể tìm trên trang sản phẩm."
  };

  for (let keyword in autoReplies) {
    if (text.toLowerCase().includes(keyword)) {
      return autoReplies[keyword];  // Trả lời tự động tương ứng
    }
  }
  return null;
};

const sendMessage = async ({ chatId, sender, content, userId = null }) => {
  try {
    // Tạo tin nhắn với các dữ liệu đã được destructure
    const newMessage = new Message({
      chatId,
      sender,
      content,
      userId,
      timestamp: new Date(),
    });

    await newMessage.save();
    console.log('User message saved:', newMessage);

    // Nếu tin nhắn từ user, kiểm tra auto reply
    if (sender !== 'admin') {
      const autoReplyText = getAutoReply(content);
      if (autoReplyText) {
        const autoReplyMessage = new Message({
          chatId,
          sender: 'admin',
          content: autoReplyText,
          userId: null,
          autoReply: true,
          timestamp: new Date(),
        });

        await autoReplyMessage.save();
        console.log('Auto reply saved:', autoReplyMessage);
      }
    }

    return newMessage;
  } catch (err) {
    console.error('Error in sendMessage:', err);
    throw err;
  }
};

const getMessagesByChatId = async (chatId) => {
  try {
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

    return messages || [];
  } catch (err) {
    console.error('Error fetching messages from database:', err);
    throw new Error('Error fetching messages');
  }
};


module.exports = {
  createMessage,
  sendMessage,
  getAutoReply,
  getMessagesByChatId
};

