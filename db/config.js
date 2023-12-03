const mongoose = require('mongoose');
const connectionUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-commerce';

mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));