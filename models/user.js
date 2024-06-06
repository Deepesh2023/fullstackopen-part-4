const mongoose = require('mongoose');
const config = require('../utils/config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }
  ],
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
