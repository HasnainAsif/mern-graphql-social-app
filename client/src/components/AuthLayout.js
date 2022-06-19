import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const AuthLayout = () => {
  const context = useContext(AuthContext);

  if (context.user) {
    return <Navigate to={'/'} />;
  }

  return <Outlet />;
};

export default AuthLayout;
