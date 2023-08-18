import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from './LikeButton';
import { AuthContext } from '../util/context/auth';
import DeleteButton from './DeleteButton';
import CommentButton from './CommentButton';
import { gql, useMutation } from '@apollo/client';
import { POST_FRAGMENT } from '../util/post/Graphql';

const PostCard = ({
  post: {
    id,
    body,
    username,
    createdAt,
    likeCount,
    commentCount,
    likes,
    allowComments,
  },
  deletePostCallback,
}) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [allowUnallowComments, { loading, data }] = useMutation(
    ALLOW_UNALLOW_COMMENTS_MUTATION,
    { variables: { postId: id } }
  ); // No need to update cache, because mutation is returning updated post which contains updated value of allowComments field

  return (
    <div className='post-card'>
      <div className='img_pod'>
        <img
          src='https://pbs.twimg.com/profile_images/890901007387025408/oztASP4n.jpg'
          alt='random...'
        />
      </div>
      <div className='container_copy'>
        <div className='post-detail'>
          <div>
            <h3>{moment(createdAt).fromNow(true)} ago</h3>
            <h2>{username}</h2>
            <Link to={`/posts/${id}`}>
              <p>{body}</p>
            </Link>
          </div>
          {location.pathname.includes('/posts/') && user?.role === 'admin' && (
            <div>
              <Button
                color={allowComments ? 'red' : 'teal'}
                size='large'
                onClick={allowUnallowComments}
              >
                {allowComments ? 'Block Comments' : 'Allow Comments'}
              </Button>
            </div>
          )}
        </div>

        <div className='card-actions'>
          <div>
            <CommentButton postId={id} commentCount={commentCount} />
            <LikeButton post={{ id, likeCount, likes }} />
          </div>
          {user && user.username === username && (
            <DeleteButton postId={id} callback={deletePostCallback} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

const ALLOW_UNALLOW_COMMENTS_MUTATION = gql`
  mutation allowUnallowComments($postId: ID!) {
    allowUnallowComments(postId: $postId) {
      ...post
    }
  }
  ${POST_FRAGMENT}
`;
