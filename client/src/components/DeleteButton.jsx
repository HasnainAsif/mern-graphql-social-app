import { gql, useMutation } from '@apollo/client';
import React, { Fragment, useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/post/Graphql';
import MyPopup from './MyPopup';

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrComment, { loading }] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      if (!commentId) {
        // Run if deleting a post
        const cachedPosts = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const allPosts = {};
        allPosts.getPosts = cachedPosts.getPosts.filter(
          (cachedPost) => cachedPost.id !== postId
        );

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: allPosts,
        });
      }
      if (callback) callback();
    },

    variables: { postId, commentId },
  });

  return (
    <Fragment>
      <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
        <Button
          as='div'
          color='red'
          floated='right'
          onClick={() => setConfirmOpen(true)}
          style={{ margin: 0 }}
        >
          <Icon name='trash' style={{ textAlign: 'end' }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </Fragment>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
