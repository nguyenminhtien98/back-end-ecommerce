const Message = require('../models/MessageModel');

// Lắng nghe các kết nối mới từ client
const initSocket = (io) => {

  io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Lắng nghe sự kiện gửi tin nhắn
    socket.on('send-message', async (messageData) => {
      try {
        const { chatId, sender, content, userId } = messageData;
        // Lưu tin nhắn vào MongoDB
        const newMessage = new Message({
          chatId,
          sender,
          content,
          userId: userId || null,
          timestamp: new Date(),
        });
        await newMessage.save();

        // Emit tin nhắn mới đến tất cả client đang ở room có chatId
        console.log("Phát sự kiện receive-message:", newMessage);
        io.to(chatId).emit('receive-message', newMessage);
      } catch (err) {
        console.error(err);
      }
    });

    // Lắng nghe sự kiện ngắt kết nối
    socket.on('disconnect', () => {
      console.log('User disconnected: ', socket.id);
    });
  });
};

module.exports = initSocket;
