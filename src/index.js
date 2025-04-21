const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// ===== 🔧 THÊM: Các thư viện cho realtime =====
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./Socket/Socket'); // Gọi hàm xử lý socket

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ===== 🔧 THÊM: Tạo server HTTP để tích hợp Socket.IO =====
const server = http.createServer(app);

// ===== 🔧 THÊM: Cấu hình Socket.IO =====
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Hoặc domain FE thật
        credentials: true,
    },
});

// ===== 🔧 THÊM: Gọi hàm cấu hình socket =====
setupSocket(io);

// ===== Cấu hình CORS =====
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

// ===== Khai báo routes =====
routes(app);

// ===== Kết nối MongoDB =====
mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
        console.log('✅ Connect Db success!');
    })
    .catch((err) => {
        console.log(err);
    });

// ===== 🔧 THAY ĐỔI: Dùng server.listen thay vì app.listen =====
server.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});
