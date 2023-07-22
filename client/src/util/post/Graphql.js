import { gql } from '@apollo/client';

export const LIKES_FRAGMENT = gql`
  fragment likes on Like {
    id
    username
    createdAt
  }
`;

const POST_FRAGMENT = gql`
  fragment post on Post {
    id
    body
    username
    createdAt
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
    commentCount
    likeCount
  }
`;

export const FETCH_POSTS_QUERY = gql`
  query getPosts {
    getPosts {
      ...post
    }
  }
  ${POST_FRAGMENT}
`;

export const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      ...post
    }
  }
  ${POST_FRAGMENT}
`;
