import React from 'react';
import MyPopup from './MyPopup';
import { Button, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const CommentButton = ({ postId, commentCount }) => {
  return (
    <MyPopup content='Comment on post'>
      <span>
        <Button labelPosition='right' as={Link} to={`/posts/${postId}`}>
          <Button color='blue' basic>
            <Icon name='comments' />
          </Button>
          <Label basic color='teal' pointing='left'>
            {commentCount}
          </Label>
        </Button>
        {/* <i className='fa-regular fa-comment'></i>
        {commentCount} */}
      </span>
    </MyPopup>
  );
};

export default CommentButton;
