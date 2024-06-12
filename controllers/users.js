const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;

  

  if (username.length < 3 || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'username/password should be atleast 3 chara long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
  });

  try {
    const createdUser = await newUser.save();
    response.status(201).json(createdUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
