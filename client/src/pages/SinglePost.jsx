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
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';
import MyPopup from '../components/MyPopup';
import { AuthContext } from '../util/context/auth';
import { FETCH_POST_QUERY } from '../util/post/Graphql';
import PostCard from '../components/PostCard';

const SinglePost = () => {
  const { user } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);

  const {
    loading,
    data: { getPost } = {}, // setting default value, because initially data is undefined when loading is true
    error,
  } = useQuery(FETCH_POST_QUERY, { variables: { postId: params.postId } });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();

      // No need to update cache because query is returing updated comments and comments count (Comments and Comments Count will be automatically updated in cache due to returned values).
    },
    variables: {
      postId: params.postId,
      body: comment,
    },
  });

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
      comments,
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
              {user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a comment</p>
                    <Form size='huge'>
                      <div className='ui action input fluid'>
                        <input
                          type='text'
                          placeholder='Comment...'
                          name='comment'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          ref={commentInputRef}
                        />
                        <button
                          type='submit'
                          className='ui button teal'
                          disabled={comment.trim() === ''}
                          onClick={submitComment}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              <section className='comments-section'>
                {commentCount && <h1>Comments</h1>}
                {comments.map((comment) => (
                  <Card fluid key={comment.id}>
                    <Card.Content>
                      {user && user.username === comment.username && (
                        <DeleteButton postId={id} commentId={comment.id} />
                      )}
                      <Card.Header>{comment.username}</Card.Header>
                      <Card.Meta>
                        {moment(comment.createdAt).fromNow()}
                      </Card.Meta>
                      <Card.Description>{comment.body}</Card.Description>
                    </Card.Content>
                  </Card>
                ))}
              </section>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }

  return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default SinglePost;
