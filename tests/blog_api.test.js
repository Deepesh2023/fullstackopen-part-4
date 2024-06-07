const { test, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');

const app = require('../app');
const { default: mongoose } = require('mongoose');

const Blog = require('../models/blog');
const User = require('../models/user');

const helper = require('./blog_test_helper');
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const blogsPromiseArray = helper.initialBlogs.map((blog) => {
    const newBlog = new Blog(blog);
    return newBlog.save();
  });

  const usersPromiseArray = helper.initialUsers.map((user) => {
    const response = api.post('/api/users').send(user);
    return response;
  });

  await Promise.all(blogsPromiseArray);
  await Promise.all(usersPromiseArray);
});

describe('all user routes', () => {
  test('can successfully create a new user', async () => {
    const newUser = {
      username: 'art3mis',
      name: 'vaishnu',
      password: 'vaishnu',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const users = await User.find({});

    assert.strictEqual(newUser.username, response.body.username);
    assert.strictEqual(users.length, helper.initialUsers.length + 1);
  });

  test('returns all the users', async () => {
    const response = await api.get('/api/users').expect(200);
    assert.strictEqual(response.body.length, helper.initialUsers.length);
  });

  test('cannot create user if username already exists', async () => {
    await api.post('/api/users').send(helper.initialUsers[0]).expect(400);
    const users = await helper.getAllUsers();

    assert.strictEqual(users.length, helper.initialUsers.length);
  });

  test('cannot create user with username less than 3 characters', async () => {
    const newUser = {
      username: 'fd',
      name: 'fred dominics',
      password: 'trwtrw',
    };

    await api.post('/api/users').send(newUser).expect(400);
    const users = await helper.getAllUsers();

    assert.strictEqual(users.length, helper.initialUsers.length);
  });
});

describe('all login routes', () => {
  test('can login with valid username and password', async () => {
    const userCreds = {
      username: 'cherryistamallthecherry',
      password: 'bhadra',
    };
    const response = await api.post('/api/login').send(userCreds).expect(200);

    assert.strictEqual(response.body.username, userCreds.username);
    assert(response.body.token);
  });

  test('returns error if login with a username that doesnt exists', async () => {
    const user = {
      username: 'chandran',
      password: 'trewtr',
    };

    await api.post('/api/login').send(user).expect(400);
  });

  test('returns error if login with a wrong password', async () => {
    const user = {
      username: 'light_yagamesh',
      password: 'trewtr',
    };

    await api.post('/api/login').send(user).expect(401);
  });
});

describe('all blogs route', () => {
  test('returns a single blog', async () => {
    const blog = JSON.parse(await helper.getSingleBlog());

    const response = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.deepStrictEqual(response.body, blog);
  });

  test('gets all the blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('can successfully create a blog with the logged in user', async () => {
    const newBlog = {
      title: 'blog post test',
      author: 'jest',
      url: 'fdsagnv.com',
      likes: 0,
    };

    const loggedInResponse = await api.post('/api/login').send({
      username: 'light_yagamesh',
      password: 'deepesh',
    });

    const token = loggedInResponse.body.token;

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const blogs = await Blog.find({});

    assert.strictEqual(response.body.author, newBlog.author);
    assert(response.body.user);
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  });

  test('cannot post new blog with invalid token', async () => {
    const newBlog = {
      title: 'blog post test',
      author: 'jest',
      url: 'fdsagnv.com',
      likes: 0,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);

    const blogs = await Blog.find({});
    assert.strictEqual(blogs.length, helper.initialBlogs.length);
  });

  test('the default "_id" key name is changed to "id"', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogs = response.body;

    blogs.forEach((blog) => {
      assert(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });

  test('if no likes is provided, post likes default to zero', async () => {
    const blogWithoutLikes = {
      title: 'blog post test',
      author: 'jest',
      url: 'fdsagnv.com',
    };

    const loggedInResponse = await api.post('/api/login').send({
      username: 'light_yagamesh',
      password: 'deepesh',
    });

    const token = loggedInResponse.body.token;

    const response = await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const newBlog = response.body;
    assert.strictEqual(newBlog.likes, 0);
  });

  test('gives error if title or url is missing', async () => {
    const invalidBlog = {
      author: 'jest',
      url: 'fdsagnv.com',
    };

    const loggedInResponse = await api.post('/api/login').send({
      username: 'light_yagamesh',
      password: 'deepesh',
    });

    const token = loggedInResponse.body.token;

    const response = await api
      .post('/api/blogs')
      .send(invalidBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    const blogs = await Blog.find({});
    assert.strictEqual(blogs.length, helper.initialBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
