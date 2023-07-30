const gql = require('graphql-tag');

const typeDefs = gql`
  type Post {
    id: ID! # ! means non-nullable
    body: String!
    username: String!
    createdAt: String!
    # comments: [Comment]!
    likes: [Like]! # ! means likes will be an array and will have zero or more items.
    likeCount: Int!
    commentCount: Int!
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

  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input GetCommentsArgs {
    postId: String!
    first: Int
    after: String
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post!
    getComments(commentsArgs: GetCommentsArgs): GetComments!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!

    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): CommentEdge!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likeUnlikePost(postId: ID!): Post!
  }

  # type Subscription {
  #   newPost: Post!
  # }
`;

module.exports = typeDefs;
