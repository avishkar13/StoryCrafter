// routes/contentRoutes.js
import express from 'express';
import {
  createContent,
  getUserContent,
  deleteContent,
  generateContent,
  saveContent ,
} from '../controllers/contentController.js';

import  protect  from '../middleware/authMiddleware.js'; // ensures user is logged in

const router = express.Router();

// Protected Routes
router.post('/', protect, createContent);            // Create content manually
router.get('/', protect, getUserContent);            // Get all content for logged-in user
router.post('/save', protect, saveContent);         // Save content to the database
router.delete('/:id', protect, deleteContent);       // Delete a specific content item
router.post('/generate', protect, generateContent);  // AI-based content generation

export default router;
