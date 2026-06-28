const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  category: { type: String, enum: ['recycling_tips', 'general_discussion', 'questions', 'impact'], default: 'general_discussion' }
}, { timestamps: true });

communityPostSchema.index({ category: 1 });
communityPostSchema.index({ author: 1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
