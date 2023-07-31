import { gql, useMutation } from '@apollo/client';
import React, { Fragment, useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { FETCH_COMMENTS_QUERY, FETCH_POSTS_QUERY } from '../util/post/Graphql';
import MyPopup from './MyPopup';
import { PAGINATION_LIMIT } from '../util/Constants';

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrComment, { loading }] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      if (commentId) {
        // Run if deleting a comment

        // no need to update commentCount from post cache because deleteComment mutation is returning updated commentCount and id of post. Graphql will automaticallty match returned id with post_id in cache and will update commentCount for this post.
        // ---------------- Delete comment From cache also -------------------
        let cachedComments = proxy.readQuery({
          query: FETCH_COMMENTS_QUERY,
          variables: { postId, first: PAGINATION_LIMIT.COMMENTS },
        });

        const filteredEdges = cachedComments.getComments.edges.filter(
          ({ node, cursor }) => node.id !== commentId
        );
        const allComments = {};
        allComments.getComments = {
          ...cachedComments.getComments,
          pageInfo: {
            ...cachedComments.getComments.pageInfo,
            endCursor: filteredEdges[filteredEdges.length - 1].cursor, // update cursor. It is possible that someone has deleted last comment from current pagination(In this case, previous endCursor will no more exist).
          },
          edges: filteredEdges,
        };

        proxy.writeQuery({
          query: FETCH_COMMENTS_QUERY,
          data: allComments,
          variables: { postId, first: PAGINATION_LIMIT.COMMENTS },
        });
      }

      if (!commentId) {
        // Run if deleting a post
        const cachedPosts = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        if (cachedPosts) {
          // run if we are at home page or we navigated from home to post detail page and never refresh page

          // -------------- Delete post from home page cache ----------------
          const allPosts = {};
          allPosts.getPosts = cachedPosts.getPosts.filter(
            (cachedPost) => cachedPost.id !== postId
          );

          proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: allPosts,
          });
        }

        // If we delete post from post detail page then we can also make its cache null, just like comments from below code

        // ------------------- delete all relevant comments to this post -----------------
        const allComments = {};
        allComments.getComments = null;

        proxy.writeQuery({
          query: FETCH_COMMENTS_QUERY,
          data: allComments,
          variables: { postId },
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
      commentCount
    }
  }
`;

export default DeleteButton;
