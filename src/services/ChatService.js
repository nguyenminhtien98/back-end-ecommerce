const Chat = require('../models/ChatModel');
const Message = require('../models/MessageModel');
const mongoose = require('mongoose');

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


const createOrGetChat = async ({ userId, guestId }) => {
  try {
    let chat;
    if (userId) {
      // Tìm theo userId
      chat = await Chat.findOne({ userId });
      if (chat) {
        // Nếu tìm thấy conversation của user, thì không cần merge
        return {
          status: 'OK',
          message: 'Success',
          data: {
            _id: chat._id.toString(),
            userId: chat.userId,
            guestId: chat.guestId,
          },
          needsMerge: false
        };
      } else if (guestId) {
        // Nếu không tìm thấy chat theo userId, kiểm tra xem có guest chat nào tồn tại với guestId chưa được merge (userId still null)
        chat = await Chat.findOne({ guestId, userId: { $in: [null, ""] } });
        if (chat) {
          // Nếu có guest chat, trả về với flag cần merge
          return {
            status: 'OK',
            message: 'Guest conversation exists, needs merge',
            data: {
              _id: chat._id.toString(),
              userId: chat.userId,
              guestId: chat.guestId,
            },
            needsMerge: true
          };
        } else {
          // Không tìm thấy, tạo mới conversation cho user
          chat = await Chat.create({ userId, guestId: null });
          return {
            status: 'OK',
            message: 'Success',
            data: {
              _id: chat._id.toString(),
              userId: chat.userId,
              guestId: chat.guestId,
            },
            needsMerge: false
          };
        }
      } else {
        // Không có guestId, tạo trực tiếp
        chat = await Chat.create({ userId, guestId: null });
        return {
          status: 'OK',
          message: 'Success',
          data: {
            _id: chat._id.toString(),
            userId: chat.userId,
            guestId: chat.guestId,
          },
          needsMerge: false
        };
      }
    } else if (guestId) {
      // Branch guest: tìm hoặc tạo dựa trên guestId
      chat = await Chat.findOne({ guestId });
      if (!chat) {
        chat = await Chat.create({ guestId });
      }
      return {
        status: 'OK',
        message: 'Success',
        data: {
          _id: chat._id.toString(),
          userId: chat.userId,
          guestId: chat.guestId,
        }
      };
    }
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

const sendMessage = async ({ chatId, sender, content, userId = null }) => {
  try {
    // Kiểm tra tính hợp lệ của chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      console.error('Invalid chatId:', chatId);
      throw new Error('Invalid chatId');
    }
    // Tìm Chat theo chatId
    let chat = await Chat.findById(chatId);
    if (!chat) {
      console.warn('Chat not found for chatId:', chatId, '- Creating new chat.');

      // Chuẩn bị dữ liệu chat dựa trên sender:
      // Nếu sender là 'user' (đã đăng nhập) dùng userId, còn nếu guest thì dùng guestId
      let chatData = {};
      if (sender === 'user' && userId) {
        chatData.userId = userId;
        chatData.guestId = null;
      } else {
        chatData.guestId = userId; // Giả sử userId đang lưu giá trị guest: "guest-xxx"
      }

      const newChatResponse = await createChat(chatData);
      if (newChatResponse.status === 'OK') {
        chat = newChatResponse.data;
        console.log("Created new Chat with chatId:", chat._id);
      } else {
        console.error("Unable to create new chat");
        throw new Error("Unable to create new chat");
      }
    }
    console.log('Found Chat:', chat._id, 'Current messages:', chat.messages);
    // Tạo và lưu tin nhắn của người dùng
    const message = new Message({
      chatId: chat._id,
      sender,
      content,
      autoReply: false,
      // Nếu sender là "user", ta lưu userId được truyền vào,
      // nếu sender là guest (ví dụ "gues"), ta luôn lưu null.
      userId: sender === 'user' ? userId : null,
      timestamp: new Date(),
    });
    const savedMessage = await message.save();
    console.log('User message saved:', savedMessage);

    // Cập nhật Chat với tin nhắn mới này
    const updateResult = await Chat.findByIdAndUpdate(
      chat._id,
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

    // (Phần auto-reply có thể xử lý riêng tại file MessageService)
    return {
      status: 'OK',
      message: savedMessage
    };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

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

const mergeGuestChat = async (guestChatId, userId) => {
  try {
    // Kiểm tra nếu user đã có cuộc hội thoại trước đó
    const existingChat = await Chat.findOne({ userId });

    if (existingChat) {
      console.log("User đã có chat trước, gộp tin nhắn vào chatId:", existingChat._id);

      // Cập nhật tất cả tin nhắn từ guestChatId sang chatId cũ
      await Message.updateMany({ chatId: guestChatId }, { chatId: existingChat._id, userId });

      // Xóa cuộc hội thoại guest cũ
      await Chat.deleteOne({ _id: guestChatId });

      // Lấy lại toàn bộ danh sách tin nhắn của chat đã gộp
      const updatedMessages = await Message.find({ chatId: existingChat._id });

      return { chatId: existingChat._id, userId, messages: updatedMessages };
    } else {
      console.log("User chưa có chat trước, gán cuộc hội thoại guest thành tài khoản user.");

      // Nếu user chưa từng chat, chỉ cần cập nhật userId cho cuộc hội thoại guest
      const guestChat = await Chat.findById(guestChatId);
      guestChat.userId = userId;
      guestChat.isGuest = false;
      await guestChat.save();

      // Cập nhật userId cho tất cả tin nhắn của chat này
      await Message.updateMany({ chatId: guestChatId }, { userId });

      const updatedMessages = await Message.find({ chatId: guestChatId });

      return { chatId: guestChatId, userId, messages: updatedMessages };
    }
  } catch (error) {
    console.error("Lỗi khi merge guest chat:", error);
    return null;
  }
};

module.exports = {
  createChat,
  createOrGetChat,
  getAllChats,
  getChatById,
  sendMessage,
  getMessages,
  mergeGuestChat
};
