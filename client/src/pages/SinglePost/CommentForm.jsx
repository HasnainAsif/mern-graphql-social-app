import { gql, useMutation } from '@apollo/client';
import React, { useRef, useState } from 'react';
import { Card, Form } from 'semantic-ui-react';
import { FETCH_POST_QUERY } from '../../util/post/Graphql';
import {
  readCommentsCacheByPostId,
  writeCommentsCacheByPostId,
} from '../../util/helper';

const CommentForm = (params) => {
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: {
      postId: params.postId,
      body: comment,
    },
    update(proxy, { data: { createComment: commentEdge } }) {
      // -------------------- add new comment in comment's query cache ---------------------
      let cachedComments = readCommentsCacheByPostId({
        proxy,
        postId: params.postId,
      });

      if (!cachedComments) {
        cachedComments = {};
        cachedComments.getComments = {
          pageInfo: {
            hasNextPage: false,
            endCursor: commentEdge.node.createdAt,
          },
        };
      }

      const allComments = {};
      allComments.getComments = {
        ...cachedComments?.getComments,
        edges: [
          { ...commentEdge },
          ...(cachedComments?.getComments?.edges || []),
        ],
      };

      writeCommentsCacheByPostId({
        proxy,
        postId: params.postId,
        updatedComments: allComments,
      });

      // ----------------------- update comments count in post query cache -----------------------
      const cachedPost = proxy.readQuery({
        query: FETCH_POST_QUERY,
        variables: { postId: params.postId },
      });

      const updatedPost = {};
      updatedPost.getPost = {
        ...cachedPost.getPost,
        commentCount: cachedPost.getPost.commentCount + 1,
      };
      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: updatedPost,
        variables: { postId: params.postId },
      });

      setComment('');
      commentInputRef.current.blur();
    },
  });

  return (
    <Card fluid>
      <Card.Content>
        <p>Post a comment</p>
        <Form size='huge'>
          <div className='ui action input fluid'>
            <input
              type='text'
              placeholder='Comment...'
              name='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              ref={commentInputRef}
            />
            <button
              type='submit'
              className='ui button teal'
              disabled={comment.trim() === ''}
              onClick={submitComment}
            >
              Submit
            </button>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default CommentForm;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      node {
        id
        body
        postId
        username
        createdAt
      }
      cursor
    }
  }
`;
