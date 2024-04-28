const express = require('express');
const Post = require('../models/Post');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();
const uploadMiddleware = multer({ dest: 'uploads/' });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', ['username']);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// Create post
router.post('/', authMiddleware, uploadMiddleware.single('cover'), async (req, res) => {
  try {
    const { title, summary, content, tags, category, published } = req.body;
    
    let coverPath = '';
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      coverPath = path + '.' + ext;
      
      const fs = require('fs');
      fs.renameSync(path, coverPath);
    }

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: coverPath,
      author: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'general',
      published: published === 'true'
    });

    res.status(201).json(postDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Failed to create post' });
  }
});

// Update post
router.put('/:id', authMiddleware, uploadMiddleware.single('cover'), async (req, res) => {
  try {
    const { title, summary, content, tags, category, published } = req.body;
    
    const postDoc = await Post.findById(req.params.id);
    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (postDoc.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    let coverPath = postDoc.cover;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      coverPath = path + '.' + ext;
      
      const fs = require('fs');
      fs.renameSync(path, coverPath);
    }

    await Post.findByIdAndUpdate(req.params.id, {
      title,
      summary,
      content,
      cover: coverPath,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'general',
      published: published === 'true'
    });

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const postDoc = await Post.findById(req.params.id);
    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (postDoc.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete post' });
  }
});

// Toggle featured post (admin only)
router.patch('/:id/featured', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.featured = !post.featured;
    await post.save();

    res.json({ message: `Post ${post.featured ? 'featured' : 'unfeatured'} successfully` });
  } catch (error) {
    res.status(400).json({ message: 'Failed to toggle featured status' });
  }
});

module.exports = router;
