const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_inventory';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('\n======================================================');
    console.error('❌ MONGODB CONNECTION FAILED:');
    console.error(`   ${error.message}`);
    console.error('------------------------------------------------------');
    console.error('💡 To fix this, choose one of these two options:');
    console.error('   1. If using Local MongoDB on Windows:');
    console.error('      Make sure the MongoDB service is running:');
    console.error('      Open PowerShell as Administrator and run:');
    console.error('      > net start MongoDB');
    console.error('      (or run mongod in your terminal)');
    console.error('   2. If using Cloud MongoDB Atlas:');
    console.error('      Paste your Atlas connection URI inside backend/.env:');
    console.error('      MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smart_inventory');
    console.error('======================================================\n');
  }
};

module.exports = connectDB;
