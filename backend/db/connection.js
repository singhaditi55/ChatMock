// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb+srv://aditikumari5281_db_user:AditiK567@cluster0.kbmkvha.mongodb.net/chatmock');
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.log(err);
//   }
// };



// module.exports = connectDB;


// // mongodb+srv://aditikumari5281_db_user:<db_password>@cluster0.kbmkvha.mongodb.net/?appName=Cluster0


import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
