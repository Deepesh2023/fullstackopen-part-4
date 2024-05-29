const mongoose = require('mongoose');

const logger = require('../utils/logger');
const config = require('../utils/config');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose.connect(config.MONGODB_URI);

module.exports = Blog;
