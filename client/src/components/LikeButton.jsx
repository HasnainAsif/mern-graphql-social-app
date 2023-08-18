import { gql, useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import { AuthContext } from '../util/context/auth';
import MyPopup from './MyPopup';

const LikeButton = ({ post: { id: postId, likeCount, likes = [] } = {} }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);

  const getOptismisticLike = () => {
    const clonedLikes = [...likes];

    const idx = clonedLikes.findIndex(
      (like) => like.username === user?.username
    );

    const isLiked = idx !== -1;
    const _likeCount = isLiked ? likeCount - 1 : likeCount + 1;

    if (isLiked) {
      clonedLikes.splice(idx, 1);
    } else {
      clonedLikes.push({
        id: Math.random(),
        username: user?.username,
        createdAt: new Date().toISOString(),
        __typename: 'Like',
      });
    }

    return { likeCount: _likeCount, likes: clonedLikes };
  };

  const [likeUnlikePostMutation, { loading, data, error }] = useMutation(
    LIKE_UNLIKE_MUTATION,
    {
      variables: { postId },
      optimisticResponse: {
        // updates UI Without waiting for response from request. After request completion, UI will update again.
        likeUnlikePost: {
          id: postId,
          likes: [...getOptismisticLike().likes],
          likeCount: getOptismisticLike().likeCount,
          __typename: 'Post',
        },
      },
      onCompleted: () => {
        console.log('LIKE-UNLIKE SUCCESSFUL');
      },
    }
    // No need to update cache, because updated likes and likesCount are returned from mutation(it will automatically update cache)
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
      <Button as='div' labelPosition='right' onClick={likeUnlikePostMutation}>
        {likeButton}
        <Label basic color='teal' pointing='left'>
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
};

const LIKE_UNLIKE_MUTATION = gql`
  mutation likeUnlikePostMutation($postId: ID!) {
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
