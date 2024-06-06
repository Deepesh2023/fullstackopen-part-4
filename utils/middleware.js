const unknownEndPoint = (request, response) => {
  response.send('<h1>Page not found</h1>');
};

const errorHandler = (error, request, response, next) => {
  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  }
  next(error);
};

module.exports = { unknownEndPoint, errorHandler };
