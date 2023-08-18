const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { skip, combineResolvers } = require('graphql-resolvers');
const { Post, Comment } = require('../models/Post');

const authMiddleware = (context) => {
  const token = context.req.header('Authorization');
  //   const token = context.req.headers.authorization;

  if (!token) {
    return null;
    //   throw new Error('Authentication Denied')
    // throw new AuthenticationError('Authorization Header must be provided');
  }

  try {
    let authString = token.split(' ');
    let decodedUser = jwt.verify(authString[1], SECRET_KEY);
    return decodedUser; // { id, email, username }
  } catch (error) {
    return null;
    // throw new AuthenticationError('Invalid/Expired Token'); // Your session expired. Sign in again
  }
};

const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new AuthenticationError('Not authenticated as user.');

const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === 'admin' ? skip : new ForbiddenError('Not authorized as admin.')
);

const isPostOwner = async (parent, { postId }, { me }) => {
  const post = await Post.findById(postId).catch((error) => {
    if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
      error = 'Post not found';
    }
    throw new UserInputError('Post not found');
  });

  if (!post) {
    throw new UserInputError('Post not found');
  }

  if (post.user.toString() !== me.id) {
    throw new ForbiddenError('Not authenticated as owner');
  }

  return skip;
};

const isCommentOwner = async (parent, { postId, commentId }, { me }) => {
  const post = await Post.findById(postId).catch((error) => {
    if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
      error = 'Post not found';
    }
    throw new UserInputError(error);
  });
  if (!post) {
    throw new UserInputError('Post not found');
  }
  const commentIdx = post.comments.findIndex(
    (comment) => comment.id === commentId
  );

  if (commentIdx === -1) {
    throw new UserInputError('Comment not found');
  }

  const comment = await Comment.findById(commentId).catch((error) => {
    if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
      error = 'Comment not found';
    }
    throw new UserInputError(error);
  });
  if (!comment) {
    throw new UserInputError('Comment not found');
  }

  if (comment.user.toString() !== userId) {
    throw new ForbiddenError('Not authenticated as owner');
  }
};

// isAdminOrPostOwner

module.exports = {
  authMiddleware,
  isAuthenticated,
  isAdmin,
  isPostOwner,
  isCommentOwner,
};
