import { gql, useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import { AuthContext } from '../util/context/auth';
import MyPopup from './MyPopup';

const LikeButton = ({ post: { id, likeCount, likes } = {} }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);

  const [likeUnlikePost, { loading, data, error }] = useMutation(
    LIKE_UNLIKE_MUTATION,
    {
      variables: { postId: id },
    }
    // No need to update cache, because updated likes and likesCount are returned from query(it will automatically update cache)
  );

  useEffect(() => {
    if (user && likes.some((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const likeButton = user ? (
    liked ? (
      <Button color='teal'>
        <Icon name='heart' />
      </Button>
    ) : (
      <Button color='teal' basic>
        <Icon name='heart' />
      </Button>
    )
  ) : (
    <Button as={Link} to='/login' color='teal' basic>
      <Icon name='heart' />
    </Button>
  );

  return (
    <MyPopup content={liked ? 'Unlike post' : 'Like post'}>
      <Button as='div' labelPosition='right' onClick={likeUnlikePost}>
        {likeButton}
        <Label basic color='teal' pointing='left'>
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
};

const LIKE_UNLIKE_MUTATION = gql`
  mutation likeUnlikePost($postId: ID!) {
    likeUnlikePost(postId: $postId) {
      id
      likes {
        id
        username
        createdAt
      }
      likeCount
    }
  }
`;

export default LikeButton;
