// scripts/fixMessages.js
const mongoose = require('mongoose');
const Chat = require('../src/models/ChatModel');
const Message = require('../src/models/MessageModel');

async function fixMessages() {
    try {
        await mongoose.connect('mongodb+srv://nguyenminhtienhy1998:11091998@cluster0.k9aoq.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const messages = await Message.find();
        for (const message of messages) {
            // Giả sử bạn lưu guestId trong Chat và có thể liên kết với message
            // Cần logic cụ thể để tìm Chat tương ứng với chatId (UUID)
            const chat = await Chat.findOne({ /* guestId: message.guestId hoặc logic khác */ });
            if (chat) {
                await Message.updateOne(
                    { _id: message._id },
                    { $set: { chatId: chat._id } }
                );
                console.log(`Updated message ${message._id} with chatId ${chat._id}`);
            } else {
                console.log(`No Chat found for message ${message._id}`);
            }
        }

        console.log('Data migration completed');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}

fixMessages();