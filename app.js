const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

const app = express();

// თუ სჭირდება, გააქტიურე CORS აპლიკაციაზე, Socket.IO-ს CORS-სთან ერთად
app.use(cors({
  origin: 'https://chatme.onrender.com', // მხოლოდ შენს რეაქტ აპლიკაციას აუშვებს
}));

// სტატიკური ფოლდერი (თუ შენ იყენებ React-ის build-ს, რომელიც “dist” ან “build” ფოლდერშია)
app.use(express.static(path.join(__dirname, 'dist')));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://chatme.onrender.com', // Socket.IO-სთვის CORS
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
