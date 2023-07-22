import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../util/hooks';
import { AuthContext } from '../util/context/auth';

const Login = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, formData } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });
  const { username, password } = formData;

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      setErrors({});
      context.login(userData);
      navigate('/', { replace: true });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: formData,
  });

  // Using concept of hoisting
  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className='form-container'>
      {/* className={(loading && 'loading') ?? ''} */}
      <Form
        onSubmit={onSubmit}
        noValidate
        className={loading ? 'loading' : ''}
        size='huge'
      >
        <h1>Login</h1>
        <Form.Input
          type='text'
          label='Username'
          placeholder='Enter Username'
          name='username'
          error={!!errors.username}
          onChange={onChange}
          value={username}
        />
        <Form.Input
          type='password'
          label='Password'
          placeholder='Enter Password'
          name='password'
          error={!!errors.password}
          onChange={onChange}
          value={password}
        />
        <Button type='submit' primary size='huge'>
          Login
        </Button>
      </Form>

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
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Login;
