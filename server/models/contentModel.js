// models/contentModel.js

import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },

  type: {
    type: String,
    enum: ['script', 'title', 'thumbnailPrompt', 'seo'],
    required: true,
  },

  data: {
    type: mongoose.Schema.Types.Mixed, // flexible structure for AI data
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model('Content', contentSchema);

export default Content;
