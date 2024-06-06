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
    const newUser = new User(user);
    return newUser.save();
  });

  await Promise.all(blogsPromiseArray);
  await Promise.all(usersPromiseArray);
});

describe('all http get request', () => {
  test('returns a single blog', async () => {
    const blog = JSON.parse(await helper.getSingleBlog());

    const response = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.deepStrictEqual(response.body, blog);
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
});

describe('all http post request', () => {
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

    assert.strictEqual(
      helper.initialBlogs.length + 1,
      JSON.parse(blogsOnDataBase).length
    );
  });

  test('if no likes is provided, post likes default to zero', async () => {
    const blogWithoutLikes = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    const response = await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .expect(201);

    const newBlog = response.body;
    assert.strictEqual(newBlog.likes, 0);
  });

  test('returns bad request error 400 when posting a new blog without blog title or url', async () => {
    const blogWithoutTitle = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    };

    const blogWithoutUrl = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };

    await api.post('/api/blogs').send(blogWithoutTitle).expect(400);
    await api.post('/api/blogs').send(blogWithoutUrl).expect(400);
  });
});

describe('deleting a single blog', () => {
  test('deletes the given blog successfully', async () => {
    const blogs = await helper.getAllBlogs();
    const blog = JSON.parse(blogs)[0];
    await api.delete(`/api/blogs/${blog.id}`).expect(204);

    const blogsOnDataBase = await helper.getAllBlogs();
    assert.strictEqual(
      helper.initialBlogs.length - 1,
      JSON.parse(blogsOnDataBase).length
    );
  });
  test('returns error if invalid url is given', async () => {
    const id = '5';
    await api.delete(`/api/blogs/${id}`).expect(400);

    const blogsOnDataBase = await helper.getAllBlogs();
    assert.strictEqual(
      helper.initialBlogs.length,
      JSON.parse(blogsOnDataBase).length
    );
  });
});

describe('updating blogs', () => {
  test('updating a blog successfully', async () => {
    const blog = JSON.parse(await helper.getSingleBlog());
    blog.likes = 54;

    const response = await api
      .put(`/api/blogs/${blog.id}`)
      .send(blog)
      .expect(200);

    assert.deepStrictEqual(blog, response.body);

    const blogsOnDataBase = JSON.parse(await helper.getAllBlogs());

    const wasBlogUpdated = blogsOnDataBase.some(
      (blogOnDB) => blogOnDB.likes === blog.likes
    );

    assert.strictEqual(wasBlogUpdated, true);
  });

  test('returns error when trying to update a non exsisting blog', async () => {
    const blog = {
      id: '5435',
      title: 'blog update test',
      author: 'rangan',
      url: 'someurl.com',
      likes: 0,
    };

    blog.likes = 10;

    await api.put(`/api/blogs/${blog.id}`).send(blog).expect(400);

    const blogsOnDataBase = JSON.parse(await helper.getAllBlogs());

    const wasBlogUpdated = blogsOnDataBase.some(
      (blogOnDB) => blogOnDB.likes === blog.likes
    );

    assert.strictEqual(wasBlogUpdated, false);
  });
});

describe('testing the user router', () => {
  test('gets all the users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.initialUsers.length);
  });

  test('can create a new user', async () => {
    const newUser = {
      username: 'sudhakaran',
      name: 'sudhu',
      password: 'test',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(newUser.name, response.body.name);
  });
});

describe('user creation', () => {
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

  test('cannot create user if username already exists', async () => {
    await api.post('/api/users').send(helper.initialUsers[0]).expect(400);
    const users = await helper.getAllUsers();

    assert.strictEqual(users.length, helper.initialUsers.length);
  });

  describe('extra tests', () => {
    test('successfully creates a user field in a new blog post', async () => {
      const newBlog = {
        title: 'full stack development is a headache',
        author: 'deepesh',
        url: 'fdsafd.com',
      };

      const response = await api.post('/api/blogs').send(newBlog).expect(201);
      assert(response.body.user, true);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
