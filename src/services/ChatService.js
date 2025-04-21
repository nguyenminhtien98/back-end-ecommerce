const Chat = require('../models/ChatModel');
const Message = require('../models/MessageModel');

const createChat = async (chatData) => {
  try {
    const chat = new Chat(chatData);
    const savedChat = await chat.save();
    return {
      status: 'OK',
      message: 'Chat created successfully',
      data: savedChat
    };
  } catch (err) {
    throw err;
  }
};

// const createOrGetChat = async ({ userId, guestId }) => {
//   try {
//     let chat;
//     if (userId) {
//       chat = await Chat.findOne({ userId });
//       if (!chat) {
//         chat = await Chat.create({ userId });
//       }
//     } else if (guestId) {
//       chat = await Chat.findOne({ guestId });
//       if (!chat) {
//         chat = await Chat.create({ guestId });
//       }
//     }
//     return {
//       status: 'OK',
//       message: 'Success',
//       data: chat,
//     };
//   } catch (error) {
//     return {
//       status: 'ERR',
//       message: error.message,
//     };
//   }
// };

const createOrGetChat = async ({ userId, guestId }) => {
    try {
        let chat;
        if (userId) {
            chat = await Chat.findOne({ userId });
            if (!chat) {
                chat = await Chat.create({ userId });
            }
        } else if (guestId) {
            chat = await Chat.findOne({ guestId });
            if (!chat) {
                chat = await Chat.create({ guestId });
            }
        }
        return {
            status: 'OK',
            message: 'Success',
            data: {
                _id: chat._id.toString(), // Trả về _id dạng string
                userId: chat.userId,
                guestId: chat.guestId,
            },
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const getAllChats = async () => {
    try {
      const chats = await Chat.find()
        .sort({ updatedAt: -1 })
        .populate('messages');  // Lấy danh sách các tin nhắn từ messages
  
      return {
        status: 'OK',
        message: 'Fetched chats successfully',
        data: chats
      };
    } catch (err) {
      throw err;
    }
  };

const getChatById = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId).populate('messages');
    if (!chat) {
      return {
        status: 'ERR',
        message: 'Chat not found'
      };
    }
    return {
      status: 'OK',
      data: chat
    };
  } catch (err) {
    throw err;
  }
};

// const sendMessage = async ({ chatId, sender, content }) => {
//     try {
//       const message = new Message({
//         chatId,
//         sender,
//         content,
//         autoReply: false
//       });
  
//       const savedMessage = await message.save();  // Lưu tin nhắn vào bảng Message
  
//       // Thêm tin nhắn vào mảng messages trong bảng Chat
//       await Chat.findByIdAndUpdate(chatId, {
//         $push: { messages: savedMessage._id },  // Thêm ID của tin nhắn vào mảng messages
//         $set: { updatedAt: new Date() }
//       });
  
//       console.log('User message saved:', savedMessage);
  
//       // Kiểm tra nếu tin nhắn là câu hỏi gợi ý để gửi auto reply
//       const autoReplies = {
//         'Shop mở cửa lúc mấy giờ?': 'Shop mở cửa từ 9:00 sáng đến 6:00 chiều mỗi ngày.',
//         'Có ship toàn quốc không?': 'Shop có hỗ trợ giao hàng toàn quốc qua nhiều đơn vị vận chuyển.',
//         'Chính sách đổi trả như thế nào?': 'Shop hỗ trợ đổi trả trong vòng 7 ngày với sản phẩm chưa qua sử dụng.',
//         'Phí vận chuyển là bao nhiêu?': 'Phí vận chuyển tùy khu vực, sẽ hiển thị khi bạn đặt hàng.',
//         'Có size cho trẻ em không?': 'Shop hiện có size cho trẻ em từ 2 đến 12 tuổi.'
//       };
  
//       const replyContent = autoReplies[content];
//       let autoReplyMessage = null;
  
//       if (replyContent) {
//         const reply = new Message({
//           chatId,
//           sender: 'admin',
//           content: replyContent,
//           autoReply: false
//         });
//         autoReplyMessage = await reply.save();
  
//         await Chat.findByIdAndUpdate(chatId, {
//           $push: { messages: autoReplyMessage._id },
//           $set: { updatedAt: new Date() }
//         });
  
//         console.log('Auto reply triggered for:', content);
//         console.log('Auto reply saved:', autoReplyMessage);
//       }
  
//       return {
//         status: 'OK',
//         message: savedMessage
//       };
//     } catch (error) {
//       throw error;
//     }
//   };

const sendMessage = async ({ chatId, sender, content }) => {
    try {
        // Kiểm tra chatId
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            console.error('Invalid chatId:', chatId);
            throw new Error('Invalid chatId');
        }

        // Tìm Chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            console.error('Chat not found for chatId:', chatId);
            throw new Error('Chat not found');
        }
        console.log('Found Chat:', chat._id, 'Current messages:', chat.messages);

        // Lưu tin nhắn người dùng
        const message = new Message({
            chatId,
            sender,
            content,
            autoReply: false,
            userId: null,
            timestamp: new Date(),
        });
        const savedMessage = await message.save();
        console.log('User message saved:', savedMessage);

        // Cập nhật Chat với tin nhắn người dùng
        const updateResult = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: savedMessage._id },
                $set: { updatedAt: new Date() },
            },
            { new: true }
        );
        if (!updateResult) {
            console.error('Failed to update Chat with message ID:', savedMessage._id);
            throw new Error('Failed to update Chat');
        }
        console.log('Updated Chat with message ID:', savedMessage._id, 'Messages:', updateResult.messages);

        // Logic auto-reply
        const autoReplies = {
            'shop mở cửa lúc mấy giờ': 'Shop mở cửa từ 9:00 sáng đến 6:00 chiều mỗi ngày.',
            'có ship toàn quốc không': 'Shop có hỗ trợ giao hàng toàn quốc qua nhiều đơn vị vận chuyển.',
            'chính sách đổi trả như thế nào': 'Shop hỗ trợ đổi trả trong vòng 7 ngày với sản phẩm chưa qua sử dụng.',
            'phí vận chuyển là bao nhiêu': 'Phí vận chuyển tùy khu vực, sẽ hiển thị khi bạn đặt hàng.',
            'có size cho trẻ em không': 'Shop hiện có size cho trẻ em từ 2 đến 12 tuổi.',
        };
        console.log('Auto replies:', autoReplies);

        // Chuẩn hóa content
        const normalizedContent = content
            .trim()
            .toLowerCase()
            .replace(/[?.,!]/g, '')
            .replace(/\s+/g, ' ');
        console.log('Normalized content:', normalizedContent, 'Sender:', sender);

        const replyContent = autoReplies[normalizedContent];
        let autoReplyMessage = null;

        if (replyContent && sender === 'user') {
            const reply = new Message({
                chatId,
                sender: 'admin',
                content: replyContent,
                autoReply: true,
                userId: null,
                timestamp: new Date(),
            });
            autoReplyMessage = await reply.save();
            console.log('Auto reply saved:', autoReplyMessage);

            // Cập nhật Chat với auto-reply
            const autoReplyUpdateResult = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: { messages: autoReplyMessage._id },
                    $set: { updatedAt: new Date() },
                },
                { new: true }
            );
            if (!autoReplyUpdateResult) {
                console.error('Failed to update Chat with auto-reply message ID:', autoReplyMessage._id);
                throw new Error('Failed to update Chat with auto-reply');
            }
            console.log('Updated Chat with auto-reply message ID:', autoReplyMessage._id, 'Messages:', autoReplyUpdateResult.messages);
        } else {
            console.log('No auto reply triggered. Content:', normalizedContent, 'Sender:', sender);
        }

        return {
            status: 'OK',
            message: savedMessage,
            autoReply: autoReplyMessage,
        };
    } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
    }
};
// const getMessages = async (chatId) => {
//     try {
//       const chat = await Chat.findById(chatId).populate('messages');
//       if (!chat) {
//         return {
//           status: 'ERR',
//           message: 'Chat not found'
//         };
//       }
//       return {
//         status: 'OK',
//         data: chat.messages
//       };
//     } catch (error) {
//       return {
//         status: 'ERR',
//         message: error.message
//       };
//     }
//   };

const getMessages = async (chatId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            console.error('Invalid chatId:', chatId);
            return {
                status: 'ERR',
                message: 'Invalid chatId',
            };
        }

        const chat = await Chat.findById(chatId).populate('messages');
        if (!chat) {
            console.error('Chat not found for chatId:', chatId);
            return {
                status: 'ERR',
                message: 'Chat not found',
            };
        }

        return {
            status: 'OK',
            data: chat.messages,
        };
    } catch (error) {
        console.error('Error in getMessages:', error);
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

module.exports = {
  createChat,
  createOrGetChat,
  getAllChats,
  getChatById,
  sendMessage,
  getMessages
};
