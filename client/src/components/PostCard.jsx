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
    // <Card fluid>
    //   <Card.Content>
    //     <Image
    //       floated='right'
    //       size='mini'
    //       src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
    //     />
    //     <Card.Header>{username}</Card.Header>
    //     <Card.Meta as={Link} to={`/posts/${id}`}>
    //       {moment(createdAt).fromNow(true)}
    //     </Card.Meta>
    //     <Card.Description>{body}</Card.Description>
    //   </Card.Content>
    //   <Card.Content extra>
    //     <LikeButton post={{ id, likeCount, likes }} />

    //     <MyPopup content='Comment on post'>
    //       <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
    //         <Button color='blue' basic>
    //           <Icon name='comments' />
    //         </Button>
    //         <Label basic color='teal' pointing='left'>
    //           {commentCount}
    //         </Label>
    //       </Button>
    //     </MyPopup>
    //     {user && user.username === username && <DeleteButton postId={id} />}
    //   </Card.Content>
    // </Card>

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
