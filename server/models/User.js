const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String, // required checking will be added in graphql
  password: String,
  email: String,
  createdAt: String, // default value will be set in graphql
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

module.exports = model('User', userSchema);
