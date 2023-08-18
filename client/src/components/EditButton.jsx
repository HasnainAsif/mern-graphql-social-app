import React, { Fragment, useState } from 'react';
import { Button, Form, Header, Icon, Modal } from 'semantic-ui-react';
import MyPopup from './MyPopup';
import { gql, useMutation } from '@apollo/client';
import { COMMENT_FRAGMENT } from '../util/post/Graphql';

const EditButton = ({ postId, commentId, commentMsg = '' }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState(commentMsg);

  const [editCommentHandler, { loading, data, error }] = useMutation(
    EDIT_COMMENT_MUTATION,
    {
      variables: { postId, commentId, body: comment },
      onCompleted: () => {
        setOpen(false);
      },
      // Optimistic response can also be added
      update(proxy) {
        // ---------------- Update comment From cache -------------------

        const cachedComment = proxy.readFragment({
          id: `Comment:${commentId}`,
          fragment: COMMENT_FRAGMENT,
        });

        proxy.writeFragment({
          id: `Comment:${commentId}`,
          fragment: COMMENT_FRAGMENT,
          data: {
            ...cachedComment,
            body: comment,
          },
        });
      },
    }
  );

  return (
    <Fragment>
      <MyPopup content={'Edit Comment'}>
        <Button
          as='div'
          color='teal'
          onClick={() => setOpen(true)}
          style={{ margin: 0 }}
        >
          <Icon name='edit' style={{ textAlign: 'end' }} />
        </Button>
      </MyPopup>

      <Modal
        closeIcon
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header icon='edit' content='Edit Comment' />
        <Modal.Content>
          <Form size='huge' onSubmit={editCommentHandler}>
            <div className='ui action input fluid'>
              <input
                type='text'
                placeholder='Comment...'
                name='comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type='submit'
                className='ui button teal'
                disabled={comment.trim() === ''}
              >
                Update Comment
              </button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    </Fragment>
  );
};

export default EditButton;

const EDIT_COMMENT_MUTATION = gql`
  mutation editCommentMutation($postId: ID!, $commentId: ID!, $body: String!) {
    editComment(postId: $postId, commentId: $commentId, body: $body)
  }
`;
