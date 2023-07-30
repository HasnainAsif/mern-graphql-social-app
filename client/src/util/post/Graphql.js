import { gql } from '@apollo/client';

export const LIKES_FRAGMENT = gql`
  fragment likes on Like {
    id
    username
    createdAt
  }
`;

export const POST_FRAGMENT = gql`
  fragment post on Post {
    id
    body
    username
    createdAt
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

export const FETCH_COMMENTS_QUERY = gql`
  query GetComments($postId: String!, $first: Int, $after: String) {
    getComments(
      commentsArgs: { postId: $postId, first: $first, after: $after }
    ) {
      edges {
        node {
          id
          body
          postId
          username
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
