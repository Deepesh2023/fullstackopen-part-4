const dummy = (blogs) => {
  return blogs ? 1 : 0;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return (sum += blog.likes);
  }, 0);
};

const favouriteBlog = (blog) => {
  if (blog.length > 0) {
    let blogWithMostLikes = null;
    let likes = 0;

    blog.forEach((blog) => {
      if (blog.likes > likes) {
        likes = blog.likes;
        blogWithMostLikes = blog;
      }
    });

    return blogWithMostLikes;
  }

  return 'none';
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
