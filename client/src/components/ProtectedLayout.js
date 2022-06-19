import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const ProtectedLayout = () => {
  const context = useContext(AuthContext);

  if (!context.user) {
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
