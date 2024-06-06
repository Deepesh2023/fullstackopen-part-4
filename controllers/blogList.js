const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

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

blogsRouter.post('/blogs', async (request, response) => {
  const newBlog = request.body;

  if (!newBlog.title || !newBlog.url) {
    response.status(400).end();
    return;
  }

  const users = await User.find({});

  const blog = new Blog({
    title: newBlog.title,
    author: newBlog.author,
    user: users[0]._id,
    url: newBlog.url,
    likes: newBlog.likes || 0,
  });

  const result = await blog.save();

  const user = await User.findById(result.user);
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.put('/blogs/:id', async (request, response) => {
  const id = request.params.id;

  const updateBlog = request.body;
  try {
    const result = await Blog.findByIdAndUpdate(id, updateBlog, {
      new: true,
    });

    response.status(200).json(result);
  } catch (exception) {
    response.status(400).end();
  }
});

blogsRouter.delete('/blogs/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const result = await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (exception) {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
