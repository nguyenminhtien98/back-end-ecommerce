const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./Socket/Socket');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'https://shop-football-reactjs.vercel.app', // Hoặc domain FE thật
        credentials: true,
    },
});

setupSocket(io);
app.set('io', io);

const corsOptions = {
    origin: 'https://shop-football-reactjs.vercel.app/',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
        console.log('Connect Db success!');
    })
    .catch((err) => {
        console.log(err);
    });

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
