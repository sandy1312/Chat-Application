const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Serve static files (optional for frontend)
app.use(express.static('public'));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Serve your frontend HTML file
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chatMessage', (msg) => {
    const newMessage = new Message({ text: msg });
    newMessage.save()
      .then(() => {
        io.emit('chatMessage', msg); // Broadcast message to all clients
      })
      .catch(err => console.log(err));
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
