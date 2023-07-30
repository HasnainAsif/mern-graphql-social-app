import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
} from 'semantic-ui-react';
import DeleteButton from '../../components/DeleteButton';
import LikeButton from '../../components/LikeButton';
import MyPopup from '../../components/MyPopup';
import { AuthContext } from '../../util/context/auth';
import {
  FETCH_COMMENTS_QUERY,
  FETCH_POST_QUERY,
} from '../../util/post/Graphql';
import PostCard from '../../components/PostCard';
import Comments from './Comments';
import CommentForm from './CommentForm';

const SinglePost = () => {
  const { user } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  const {
    loading,
    data: { getPost } = {}, // setting default value, because initially data is undefined when loading is true
    error,
  } = useQuery(FETCH_POST_QUERY, { variables: { postId: params.postId } });

  const deletePostCallback = () => {
    navigate('/');
  };

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      username,
      createdAt,
      // comments,
      commentCount,
      likes,
      likeCount,
    } = getPost;

    postMarkup = (
      <div style={{ marginTop: '5rem' }}>
        <Grid>
          <Grid.Row centered>
            {/* <Grid.Column width={2}>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
            />
          </Grid.Column> */}
            <Grid.Column width={10}>
              {/* <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton post={{ id, likeCount, likes }} />
                <MyPopup content='Comment on post'>
                  <Button as='div' labelPosition='right'>
                    <Button color='blue' basic>
                      <Icon name='comments' />
                    </Button>
                    <Label basic color='teal' pointing='left'>
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card> */}
              {/* <div className='post-card'>
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

                  <div className='card-details'>
                    <div>
                      <span>
                        <i className='fa-regular fa-comment'></i>
                        {commentCount}
                      </span>
                      <span>
                        <i className='fa-solid fa-heart'></i>
                        {likeCount}
                      </span>
                    </div>
                    {user && user.username === username && (
                      <DeleteButton postId={id} callback={deletePostCallback} />
                    )}
                  </div>
                </div>
              </div> */}

              <section className='single-post'>
                <PostCard
                  post={getPost}
                  deletePostCallback={deletePostCallback}
                />
              </section>
              {user && <CommentForm postId={params.postId} />}

              <Comments {...{ commentCount, postId: id }} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }

  return postMarkup;
};

export default SinglePost;
