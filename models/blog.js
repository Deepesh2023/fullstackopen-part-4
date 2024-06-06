const mongoose = require('mongoose');

const logger = require('../utils/logger');
const config = require('../utils/config');
const blogsRouter = require('../controllers/blogList');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.id = doc._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose.connect(config.MONGODB_URI);

module.exports = Blog;
