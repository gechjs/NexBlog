const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || 'fallback-secret';
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({credentials:true,origin:process.env.CLIENT_URL || 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// File upload configuration
const uploadMiddleware = multer({ dest: 'uploads/' });

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexblog');

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'NexBlog API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`NexBlog server running on port ${PORT}`);
});
