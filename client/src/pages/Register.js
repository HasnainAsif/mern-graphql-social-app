import { gql, useMutation } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

const Register = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, formData } = useForm(registerUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { username, email, password, confirmPassword } = formData;

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { register: userdata } }) {
      setErrors({});
      context.login(userdata);
      navigate('/', { replace: true });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: formData,
  });

  // Using concept of hoisting
  function registerUserCallback() {
    registerUser();
  }

  return (
    <div className='form-container'>
      {/* className={(loading && 'loading') ?? ''} */}
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          type='text'
          label='Username'
          placeholder='Username...'
          name='username'
          error={errors.username}
          onChange={onChange}
          value={username}
        />
        <Form.Input
          type='email'
          label='Email'
          placeholder='Email...'
          name='email'
          error={errors.email}
          onChange={onChange}
          value={email}
        />
        <Form.Input
          type='password'
          label='Password'
          placeholder='Password...'
          name='password'
          error={errors.password}
          onChange={onChange}
          value={password}
        />
        <Form.Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password...'
          name='confirmPassword'
          error={errors.confirmPassword}
          onChange={onChange}
          value={confirmPassword}
        />
        <Button type='submit' primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Register;
