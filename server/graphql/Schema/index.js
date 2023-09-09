const gql = require('graphql-tag');
const userSchema = require('./user');
const postSchema = require('./post');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;
module.exports = [linkSchema, userSchema, postSchema];
