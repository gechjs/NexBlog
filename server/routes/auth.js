const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || 'fallback-secret';

// Register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  try {
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }

    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const userDoc = await User.findOne({ username });
    
    if (!userDoc) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    
    if (!passOk) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    jwt.sign(
      { username, id: userDoc._id, role: userDoc.role }, 
      secret, 
      {}, 
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id: userDoc._id,
          username,
          role: userDoc.role,
          email: userDoc.email
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Login failed' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('token', '').json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
