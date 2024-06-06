const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (username.length < 3 || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'username/password should be atleast 3 chara long' });
  }

  const exsistingUser = await User.findOne({ username: username });

  if (exsistingUser) {
    return response.status(400).json({ error: 'username already taken' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
  });

  const createdUser = await newUser.save();
  response.status(201).json(createdUser);
});

module.exports = usersRouter;
