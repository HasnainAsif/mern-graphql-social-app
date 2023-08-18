const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String, // required checking will be added in graphql
  username: String,
  createdAt: String,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
});

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  body: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  createdAt: String,
});

module.exports = {
  Post: model('Post', postSchema),
  Comment: model('Comment', commentSchema),
};
