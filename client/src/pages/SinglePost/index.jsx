import { useQuery } from '@apollo/client';

import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { AuthContext } from '../../util/context/auth';
import { FETCH_POST_QUERY } from '../../util/post/Graphql';
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
  } = useQuery(FETCH_POST_QUERY, {
    variables: { postId: params.postId },
    // fetchPolicy: 'cache-first', // Default Fetch policy by apollo. If data is available in cache, no need to make network request
  });

  const deletePostCallback = () => {
    navigate('/');
  };

  const { commentCount } = getPost || {};

  return (
    <div style={{ marginTop: '5rem' }}>
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={10}>
            <section className='single-post'>
              {!getPost ? (
                <p>Loading post...</p>
              ) : (
                <PostCard
                  post={getPost || {}}
                  deletePostCallback={deletePostCallback}
                />
              )}
            </section>
            {user && <CommentForm postId={params.postId} />}

            <Comments {...{ commentCount, postId: params.postId }} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default SinglePost;
