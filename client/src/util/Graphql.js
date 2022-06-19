import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
  query getPosts {
    getPosts {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`;
