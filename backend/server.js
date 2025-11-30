const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db/connection');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

connectDB();

app.use(express.static('public'));

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   Message.find().sort({ timestamp: 1 }).limit(100).then(messages => {
//     socket.emit('previous messages', messages);
//   });

//   socket.on('chat message', async (msg) => {
//     const newMessage = new Message({ text: msg.text, sender: msg.sender });
//     await newMessage.save();
//     io.emit('chat message', msg);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send previous messages to new user
  Message.find().sort({ timestamp: 1 }).limit(100).then(messages => {
    socket.emit('previous messages', messages);
  });

  // Listen for new chat messages
  socket.on('chat message', async (msg) => {
    // Save the message to MongoDB
    const newMessage = new Message({ text: msg.text, sender: msg.sender });
    await newMessage.save();

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
