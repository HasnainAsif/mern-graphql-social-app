import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import { Grid, Transition } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { AuthContext } from '../util/context/auth';
import { FETCH_POSTS_QUERY } from '../util/post/Graphql';
import React from 'react';
import { Icon, Pagination } from 'semantic-ui-react';
import { usePagination } from '../util/hooks';
import { PAGINATION_LIMIT } from '../util/Constants';
// import { client } from '../../ApolloProvider';

const Home = () => {
  const context = useContext(AuthContext);

  const {
    loading,
    error,
    data: { getPosts = {} } = {},
    refetch,
  } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      limit: PAGINATION_LIMIT.POSTS,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network', // first get data from cache and then replace data with network response if response is different from cache
  });
  const { posts, totalPosts } = getPosts;

  const { handleChangePageNo, paginatedData, pageNo, pagesCount } =
    usePagination({
      data: posts,
      totalNoOfData: totalPosts,
      type: 'backend',
    });

  const onChangePageNo = ({ offset }) => {
    refetch({ offset });
  };

  return (
    <div className='posts-section'>
      <Grid columns={3} padded>
        <Grid.Row centered>
          <h1>Recent Posts</h1>
        </Grid.Row>
        {context.user && (
          <Grid.Row style={{ marginBottom: '20px' }}>
            <PostForm />
          </Grid.Row>
        )}
        <Grid.Row>
          {loading && !posts ? (
            <h1>Loading...</h1>
          ) : !loading && !posts ? (
            <h1>No Post Found...</h1>
          ) : (
            <Transition.Group duration={200}>
              {paginatedData.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: '20px' }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>

      <div className='table-pagination'>
        <Pagination
          ellipsisItem={{
            content: <Icon name='ellipsis horizontal' />,
            icon: true,
          }}
          firstItem={{ content: <Icon name='angle double left' />, icon: true }}
          lastItem={{ content: <Icon name='angle double right' />, icon: true }}
          prevItem={{ content: <Icon name='angle left' />, icon: true }}
          nextItem={{ content: <Icon name='angle right' />, icon: true }}
          totalPages={pagesCount}
          onPageChange={(e, { activePage }) =>
            handleChangePageNo(activePage, onChangePageNo)
          }
          activePage={pageNo}
        />
      </div>
    </div>
  );
};

export default Home;
