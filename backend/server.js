// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./db/connection');
// const Message = require('./models/Message');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// connectDB();

// app.use(express.static('public'));

// // io.on('connection', (socket) => {
// //   console.log('A user connected:', socket.id);

// //   Message.find().sort({ timestamp: 1 }).limit(100).then(messages => {
// //     socket.emit('previous messages', messages);
// //   });

// //   socket.on('chat message', async (msg) => {
// //     const newMessage = new Message({ text: msg.text, sender: msg.sender });
// //     await newMessage.save();
// //     io.emit('chat message', msg);
// //   });

// //   socket.on('disconnect', () => {
// //     console.log('User disconnected:', socket.id);
// //   });
// // });



// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Send previous messages to new user
//   Message.find().sort({ timestamp: 1 }).limit(100).then(messages => {
//     socket.emit('previous messages', messages);
//   });

//   // Listen for new chat messages
//   socket.on('chat message', async (msg) => {
//     // Save the message to MongoDB
//     const newMessage = new Message({ text: msg.text, sender: msg.sender });
//     await newMessage.save();

//     // Broadcast the message to all connected clients
//     io.emit('chat message', msg);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });



// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './db/connection.js';
import Message from './models/Message.js';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

connectDB();

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  Message.find().sort({ timestamp: 1 }).limit(100).then(messages => {
    socket.emit('previous messages', messages);
  });

  socket.on('chat message', async (msg) => {
    const newMessage = new Message({ text: msg.text, sender: msg.sender });
    await newMessage.save();
    io.emit('chat message', msg);

    // AI response logic
    if (msg.text.toLowerCase().includes('slo aksi')) {
      try {
        const aiResponse = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `Respond to: ${msg.text}`,
          max_tokens: 100,
        });
        const aiMsg = {
          text: aiResponse.data.choices[0].text.trim(),
          sender: 'ai',
        };
        const aiMessage = new Message(aiMsg);
        await aiMessage.save();
        io.emit('chat message', aiMsg);
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
