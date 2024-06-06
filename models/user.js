const mongoose = require('mongoose');
const config = require('../utils/config');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
});

userSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.id = doc._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);
mongoose.connect(config.MONGODB_URI);

module.exports = User;
