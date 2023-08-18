import jwtDecode from 'jwt-decode';
import React, { createContext, useReducer } from 'react';

const initialState = { user: null };

const token = localStorage.getItem('jwtToken');
if (token) {
  const decodedToken = jwtDecode(token);
  const { id, username, email, role, exp, iat } = decodedToken;

  if (exp * 1000 > Date.now()) {
    // Token Not expired yet
    initialState.user = {
      email,
      id,
      username,
      role,
      token,
    };
  } else {
    // Token Expired
    localStorage.removeItem('jwtToken');
  }
}

// initial values for context
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LOGIN':
      return { ...state, user: payload };

    case 'LOGOUT':
      return { ...state, user: null };

    default:
      return state;
  }
};

const AuthProvider = ({ children, ...rest }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem('jwtToken', userData.token);

    dispatch({
      type: 'LOGIN',
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');

    dispatch({ type: 'LOGOUT' });
  }

  const value = {
    user: state.user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value} {...rest}>
      {children}
    </AuthContext.Provider>
    // OR
    // <AuthContext.Provider
    //   value={{ user: state.user, login, logout }}
    //   {...props}
    // />
  );
};

export { AuthContext, AuthProvider };
