const { test, describe } = require('node:test');
const assert = require('node:assert');

const listHelper = require('../utils/list_helper');
const totalLikes = require('../utils/list_helper');
const { resolveObjectURL } = require('node:buffer');

const oneBlog = {
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0,
};

const biggerListOfBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },

  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const mostLikedBlog = {
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0,
};

const authorWithMostBlogs = {
  author: 'Robert C. Martin',
  blogs: 3,
};

const authorWithMostLikes = {
  author: 'Edsger W. Dijkstra',
  likes: 17,
};

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('Total likes', () => {
  test('gives 0 when there is no blogs', () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });

  test('Gives the total likes when only one blog is given', () => {
    const blog = [oneBlog];

    const result = listHelper.totalLikes(blog);
    assert.strictEqual(result, 7);
  });

  test('gives the total likes when a bigger list is given', () => {
    const result = listHelper.totalLikes(biggerListOfBlogs);
    assert.strictEqual(result, 36);
  });
});

describe('favourite blog', () => {
  test('gives "none" when no blog is given', () => {
    const result = listHelper.favouriteBlog([]);
    assert.strictEqual(result, 'none');
  });

  test('when given only one blog, the blog itself is the favourite one', () => {
    const result = listHelper.favouriteBlog([oneBlog]);
    assert.deepStrictEqual(result, oneBlog);
  });

  test('returns the most liked blog when a bigger blog list is given', () => {
    const result = listHelper.favouriteBlog(biggerListOfBlogs);
    assert.deepStrictEqual(result, mostLikedBlog);
  });
});

describe('top blog author', () => {
  test('return "none" when an empty list is given', () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, 'none');
  });

  test('return the only blog when one blog is given', () => {
    const result = listHelper.mostBlogs([oneBlog]);
    assert.deepStrictEqual(result, { author: oneBlog.author, blogs: 1 });
  });

  test('returns the author with most blogs when a bigger blog list is given', () => {
    const result = listHelper.mostBlogs(biggerListOfBlogs);
    assert.deepStrictEqual(result, authorWithMostBlogs);
  });
});

describe('author with most likes', () => {
  test('return "none" when an empty list is given', () => {
    const result = listHelper.mostLikes([]);
    console.log(result);
    assert.strictEqual(result, 'none');
  });

  test('return the only blog when one blog is given', () => {
    const result = listHelper.mostLikes([oneBlog]);
    assert.deepStrictEqual(result, {
      author: oneBlog.author,
      likes: oneBlog.likes,
    });
  });

  test('returns the author with most likes when a bigger blog list is given', () => {
    const result = listHelper.mostLikes(biggerListOfBlogs);
    assert.deepStrictEqual(result, authorWithMostLikes);
  });
});
