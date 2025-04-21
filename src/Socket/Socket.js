const socketIo = require('socket.io');
const Message = require('../models/MessageModel'); // import model Message

// Lắng nghe các kết nối mới từ client
const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Đảm bảo domain của frontend
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    // Lắng nghe sự kiện gửi tin nhắn
    socket.on('send-message', async (messageData) => {
      try {
        // Lưu tin nhắn vào MongoDB
        const newMessage = new Message({
          sender: messageData.sender,
          content: messageData.content,
          userId: messageData.userId || null, // Nếu có userId thì lưu vào
        });
        await newMessage.save();

        // Emit tin nhắn mới tới tất cả các client
        io.emit('receive-message', newMessage);
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
