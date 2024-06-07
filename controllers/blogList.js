const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const Blog = require('../models/blog');
const User = require('../models/user');
const userExtractor = require('../utils/middleware').userExtractor;
const tokenExtractor = require('../utils/middleware').tokenExtractor;

blogsRouter.get('/', (request, response) => {
  response.send('<h1>Blog list</h1>');
});

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', '-blogs');
  response.status(200).json(blogs);
});

blogsRouter.get('/blogs/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id);
  response.json(blogs);
});

blogsRouter.post(
  '/blogs',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const newBlog = request.body;

    if (!newBlog.title || !newBlog.url) {
      response.status(400).end();
      return;
    }

    const user = request.user;

    const blog = new Blog({
      title: newBlog.title,
      author: newBlog.author,
      user: user,
      url: newBlog.url,
      likes: newBlog.likes || 0,
    });

    const result = await blog.save();

    const savedUser = await User.findById(result.user._id);
    savedUser.blogs = savedUser.blogs.concat(result._id);
    await savedUser.save();

    response.status(201).json(result);
  }
);

blogsRouter.put(
  '/blogs/:id',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const id = request.params.id;

    const updatedBlog = request.body;
    console.log(updatedBlog);

    try {
      const result = await Blog.findByIdAndUpdate(id, updatedBlog, {
        new: true,
      });

      response.status(200).json(result);
    } catch (exception) {
      response.status(400).end();
    }
  }
);

blogsRouter.delete(
  '/blogs/:id',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const id = request.params.id;
    const user = request.user;
    const blogToDelete = await Blog.findById(id);

    if (user.id.toString() !== blogToDelete.user.toString()) {
      return response.status(401).json({ error: 'unauthorized' });
    }

    try {
      const result = await Blog.findByIdAndDelete(id);
      response.status(204).end();
    } catch (exception) {
      response.status(400).end();
    }
  }
);

module.exports = blogsRouter;
