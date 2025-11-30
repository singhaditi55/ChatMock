const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://aditikumari5281_db_user:AditiK567@cluster0.kbmkvha.mongodb.net/chatmock');
    console.log('MongoDB connected');
  } catch (err) {
    console.log(err);
  }
};



module.exports = connectDB;


// mongodb+srv://aditikumari5281_db_user:<db_password>@cluster0.kbmkvha.mongodb.net/?appName=Cluster0