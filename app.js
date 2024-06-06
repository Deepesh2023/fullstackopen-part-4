const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogList');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use('/api', blogsRouter);
app.use('/api/users', usersRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndPoint);

module.exports = app;
