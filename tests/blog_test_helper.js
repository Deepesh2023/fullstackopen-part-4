const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
];

const getSingleBlog = async () => {
  const blogs = await Blog.find({});
  const blog = blogs[0];

  return JSON.stringify(blog);
};

const getAllBlogs = async () => {
  const blogs = await Blog.find({});

  return JSON.stringify(blogs);
};

const initialUsers = [
  {
    username: 'light_yagamesh',
    name: 'deepesh',
    password: 'deepesh',
  },

  {
    username: 'cherryistamallthecherry',
    name: 'bhadra',
    password: 'bhadra',
  },
];

const getAllUsers = async () => {
  const users = await User.find({});
  return users;
};

module.exports = {
  initialBlogs,
  getSingleBlog,
  getAllBlogs,
  initialUsers,
  getAllUsers,
};
