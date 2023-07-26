import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from './LikeButton';
import { AuthContext } from '../util/context/auth';
import DeleteButton from './DeleteButton';
import MyPopup from './MyPopup';
import CommentButton from './CommentButton';

const PostCard = ({
  post: {
    id,
    body,
    username,
    createdAt,
    likeCount,
    commentCount,
    // comments,
    likes,
  },
  deletePostCallback,
}) => {
  const { user } = useContext(AuthContext);

  // const commentOnPost = () => {
  //   console.log("Comment On post");
  // };

  return (
    <div className='post-card'>
      <div className='img_pod'>
        <img
          src='https://pbs.twimg.com/profile_images/890901007387025408/oztASP4n.jpg'
          alt='random...'
        />
      </div>
      <div className='container_copy'>
        <h3>{moment(createdAt).fromNow(true)} ago</h3>
        <h2>{username}</h2>
        <Link to={`/posts/${id}`}>
          <p>{body}</p>
        </Link>

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
