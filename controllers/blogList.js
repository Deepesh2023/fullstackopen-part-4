const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  response.send('<h1>Blog list</h1>');
});

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/blogs', async (request, response) => {
  const newBlog = request.body;

  if (!newBlog.title || !newBlog.url) {
    response.status(400).end();
    return;
  }

  if (!newBlog.likes) {
    newBlog.likes = 0;
  }

  const blog = new Blog(newBlog);

  const result = await blog.save();
  response.status(201).json(result);
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
