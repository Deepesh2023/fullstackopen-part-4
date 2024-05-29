const dummy = (blogs) => {
  return blogs ? 1 : 0;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return (sum += blog.likes);
  }, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
