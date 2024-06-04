const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');

const app = require('../app');
const { default: mongoose } = require('mongoose');
const Blog = require('../models/blog');

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
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test('the default "_id" key name is changed to "id"', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogs = response.body;

  blogs.forEach((blog) => {
    assert(blog.id, true);
    assert.strictEqual(blog._id, undefined);
  });
});

test('can upload a new blog to the database', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    })
    .expect(201);

  const blogsOnDataBase = await helper.getAllBlogs();

  assert.strictEqual(helper.initialBlogs.length + 1, blogsOnDataBase.length);
});

after(async () => {
  await mongoose.connection.close();
});
