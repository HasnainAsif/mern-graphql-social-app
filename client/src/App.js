import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import { AuthProvider } from './util/context/auth';
import AuthLayout from './components/AuthLayout';
import SinglePost from './pages/SinglePost';

// TODO: Fragment for posts/post or like/comment
// TODO: add table pagination of posts
// TODO: add load more pagination on comments
// TODO: add Sorting (Most liked First, Most Commented First)
// TODO: add Filtering by user, liked/unliked, commented/uncommented -- multi select
// TODO: Add admin role
// TODO: refetch functionality (to get updated comments and likes)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            element={
              <Container>
                <MenuBar />
                <Outlet />
              </Container>
            }
          >
            <Route path='/' element={<Home />} />
            <Route path='/posts/:postId' element={<SinglePost />} />

            <Route element={<AuthLayout />}>
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
            </Route>
            <Route path='*' element={<h1>Page Not Found...</h1>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
