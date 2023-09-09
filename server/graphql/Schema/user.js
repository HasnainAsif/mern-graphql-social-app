const gql = require('graphql-tag');

const typeDefs = gql`
  enum Role {
    admin
    user
  }

  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
    role: Role!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  extend type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
  }
`;

module.exports = typeDefs;
