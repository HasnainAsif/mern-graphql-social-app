import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/post/Graphql';
import { useForm } from '../util/hooks';

const PostForm = () => {
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, formData } = useForm(createPostCallback, {
    body: '',
  });
  const { body } = formData;

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    update(proxy, { data: { createPost: postData } }) {
      const cachedPosts = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
        // variables: { // Provide any required variables here.  Variables of mismatched types will return `null`.
        //   id: 5,
        // },
      });
      const allPosts = {};
      allPosts.getPosts = [postData, ...cachedPosts.getPosts];
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: allPosts,
      });

      setErrors({});
      formData.body = '';
    },
    onError(err) {
      // setErrors({ body: err.graphQLErrors[0].message }); // err.graphQLErrors[0].message === err.message
      setErrors(
        err.graphQLErrors[0].extensions.errors || {
          body: err.graphQLErrors[0].message,
        } // code after '||' will fetch authentication errors
      );
    },
    variables: formData,
  });

  // Using concept of hoisting
  function createPostCallback() {
    createPost();
  }

  return (
    <div className='create-post-section'>
      <Form onSubmit={onSubmit} size='huge' className='post-form'>
        <h2>Create Post</h2>
        <Form.TextArea
          type='text'
          placeholder='Hi World!'
          name='body'
          error={!!errors.body}
          onChange={onChange}
          value={body}
        />
        <Button type='submit' color='teal' size='huge'>
          Submit
        </Button>
      </Form>

      <div className='post-form-error'>
        {Object.keys(errors).length > 0 && (
          <div className='ui error message'>
            <ul className='list'>
              {Object.values(errors).map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
