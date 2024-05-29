const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogList');
const unknownEndPoint = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use('/api', blogsRouter);
app.use(unknownEndPoint);

module.exports = app;
