import { useQuery } from '@apollo/client';

import React, { useContext, useState } from 'react';
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
  } = useQuery(FETCH_POST_QUERY, { variables: { postId: params.postId } });

  const deletePostCallback = () => {
    navigate('/');
  };

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const { id, commentCount } = getPost;

    postMarkup = (
      <div style={{ marginTop: '5rem' }}>
        <Grid>
          <Grid.Row centered>
            <Grid.Column width={10}>
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
