const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogList');
const usersRouter = require('./controllers/users');
const unknownEndPoint = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use('/api', blogsRouter);
app.use('/api/users', usersRouter);
app.use(unknownEndPoint);

module.exports = app;
