import jwtDecode from 'jwt-decode';
import React, { createContext, useReducer } from 'react';

const AUTH_TYPE = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
};
const JWT_LOCALSTORAGE_KEY = 'jwtToken';

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
    case AUTH_TYPE.LOGIN:
      return { ...state, user: payload };

    case AUTH_TYPE.LOGOUT:
      return { ...state, user: null };

    default:
      return state;
  }
};

const AuthProvider = ({ children, ...rest }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem(JWT_LOCALSTORAGE_KEY, userData.token);

    dispatch({
      type: AUTH_TYPE.LOGIN,
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem(JWT_LOCALSTORAGE_KEY);

    dispatch({ type: AUTH_TYPE.LOGOUT });
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
  );
};

export { AuthContext, AuthProvider };
