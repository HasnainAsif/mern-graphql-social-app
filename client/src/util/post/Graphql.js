import { gql } from '@apollo/client';

export const LIKES_FRAGMENT = gql`
  fragment likes on Likes {
    likes {
      id
      username
      createdAt
    }
    likeCount
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
    likeCount
    commentCount
  }
`;

export const FETCH_POSTS_QUERY = gql`
  query getPosts($limit: Int, $offset: Int) {
    getPosts(limit: $limit, offset: $offset) {
      posts {
        ...post
      }
      totalPosts
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
