const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');

const Blog = require('../models/blog');
const app = require('../app');
const { default: mongoose } = require('mongoose');

const helper = require('./blog_test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const promiseArray = helper.initialBlogs.map((blog) => {
    const newBlog = new Blog(blog);
    return newBlog.save();
  });

  await Promise.all(promiseArray);
});

test('returns all the blogs', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(blogs.body.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
