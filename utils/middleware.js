const { error } = require('./logger');

const SECRET = require('./config').SECRET;

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    request.token = token;
    next();
  } else {
    throw new Error('invalid token');
  }
};

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

  if (error.message === 'invalid token') {
    return response.status(401).json({ error: 'invalid token' });
  }
  next(error);
};

module.exports = { tokenExtractor, unknownEndPoint, errorHandler };
