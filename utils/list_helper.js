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

const mostBlogs = (blogs) => {
  if (blogs.length !== 0) {
    const listOfAuthors = [];
    blogs.forEach((blog) => {
      if (!listOfAuthors.includes(blog.author)) {
        listOfAuthors.push(blog.author);
      }
    });

    let blogCount = 0;
    const authorsAndBlogCount = listOfAuthors.map((author) => {
      for (let i = 0; i < blogs.length; i++) {
        if (author === blogs[i].author) {
          blogCount += 1;
        }
      }

      const authorAndBlogs = { author: author, blogs: blogCount };
      blogCount = 0;
      return authorAndBlogs;
    });

    let authorWithMostBlogs = null;
    authorsAndBlogCount.forEach((authorAndBlogCount) => {
      if (authorAndBlogCount.blogs >= blogCount) {
        authorWithMostBlogs = authorAndBlogCount;
      }
    });

    return authorWithMostBlogs;
  }

  return 'none';
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
};
