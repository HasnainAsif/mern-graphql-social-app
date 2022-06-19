const postsResolvers = require('./posts');
const usersResolvers = require('./users');

module.exports = {
  Post: {
    // It will run after every "query", "mutation", "subscription" whose return type is Post
    likeCount: (parent) => parent.likes.length, // it will only execute, when it will be called from frontend
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
};
