const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  if (!user) {
    return response.status(400).json({ error: 'cannot find user' });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'incorrect password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET);

  response.status(200).send({
    token: token,
    username: user.username,
    name: user.name,
  });
});

module.exports = loginRouter;
