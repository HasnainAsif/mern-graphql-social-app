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

// TODO: update like-unlike instantly, even internet is closed (Optimistic Response) -- DONE
// TODO: Fragment for posts/post or like/comment -- DONE
// TODO: add table pagination of posts -- DONE
// TODO: add cursor pagination of comments -- DONE.
// TODO: Functionality to fetch all comments -- DONE
// TODO: add load more pagination on comments -- DONE
// TODO: refetch functionality (to get updated comments) -- DONE
// TODO: Refetch comments option, if another user made comment -- DONE
// TODO: update ApolloProvider
// TODO: Add admin role -- DONE
// TODO: readFragments/writeFragments for comments edit functionality -- DONE
// TODO: add Sorting (Most liked First, Most Commented First)
// TODO: add Filtering by user, liked/unliked, commented/uncommented -- multi select
// TODO: If token is expired, redirect to login page or add refreshed token.

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            element={
              <Container className='main-container'>
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

// POSTS CONTENT
// Starting to contribute in open source
// Going to create a new repo using Graphql, ReactJs, Nodejs in Github
