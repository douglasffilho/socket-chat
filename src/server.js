import express from 'express';
import path from 'path';
import http from 'http';
import socket from 'socket.io';
import ejs from 'ejs';

const app = express();

const server = http.createServer(app);

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.set('views', publicPath);
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    return res.render('index.html');
});

server.listen(8081, () => {
    console.log('Listening to port 8081');
});

let messages = [];

const io = socket(server);
io.on('connection', socket => {
    console.log(`connected socket: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('serverMessage', messageObject => {
        messages.push(messageObject);
        socket.broadcast.emit('receivedMessage', messageObject);
    });
});
