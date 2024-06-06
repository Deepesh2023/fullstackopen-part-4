const express = require('express');
const app = express();
const cors = require('cors');

const blogsRouter = require('./controllers/blogList');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use('/api', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndPoint);

module.exports = app;
