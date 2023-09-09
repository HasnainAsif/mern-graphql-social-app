const gql = require('graphql-tag');

const typeDefs = gql`
  type Post {
    id: ID! # ! means non-nullable
    body: String!
    username: String!
    createdAt: String!
    likes: [Like]! # ! means likes will be an array and will have zero or more items.
    likeCount: Int!
    commentCount: Int!
    allowComments: Boolean!
  }
  type GetPosts {
    posts: [Post]
    totalPosts: Int
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    postId: ID!
  }
  type CommentEdge {
    node: Comment!
    cursor: String!
  }
  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }
  type GetComments {
    edges: [CommentEdge]!
    pageInfo: PageInfo!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  input GetCommentsArgs {
    postId: String!
    first: Int
    after: String
  }

  extend type Query {
    getPosts(limit: Int, offset: Int): GetPosts!
    getPost(postId: ID!): Post!
    getComments(commentsArgs: GetCommentsArgs): GetComments!
  }

  extend type Mutation {
    createPost(body: String!): Post!
    deletePost(postId: ID!): Boolean!
    createComment(postId: ID!, body: String!): CommentEdge!
    deleteComment(postId: ID!, commentId: ID!): Post!
    editComment(postId: ID!, commentId: ID!, body: String!): Boolean
    likeUnlikePost(postId: ID!): Post!

    allowUnallowComments(postId: ID!): Post!
  }
`;

module.exports = typeDefs;
