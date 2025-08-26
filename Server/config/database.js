const mongoose = require('mongoose');

const MONGODB_URI_db = "mongodb+srv://anuragwadikar568:Bmt124567890@cluster0.dwjc9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/note_app";

const connectDB = async () => {
  try {
    const MONGODB_URI = MONGODB_URI_db || 'mongodb://localhost:27017/notes-api';
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected:', conn.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
