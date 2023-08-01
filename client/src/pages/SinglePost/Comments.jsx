import React, { useContext, useEffect } from 'react';
import DeleteButton from '../../components/DeleteButton';
import { Button, Card } from 'semantic-ui-react';
import { AuthContext } from '../../util/context/auth';
import moment from 'moment';
import { PAGINATION_LIMIT } from '../../util/Constants';
import { NetworkStatus, useQuery } from '@apollo/client';
import { FETCH_COMMENTS_QUERY } from '../../util/post/Graphql';

const Comments = ({ postId: id }) => {
  const { user } = useContext(AuthContext);

  const {
    loading,
    data: { getComments: comments } = {}, // setting default value, because initially data is undefined when loading is true
    error,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(FETCH_COMMENTS_QUERY, {
    variables: { postId: id, first: PAGINATION_LIMIT.COMMENTS },
    notifyOnNetworkStatusChange: true, // on initial load and on calling fetchMore and refetch, it will make loading true and change networkStatus
    fetchPolicy: 'network-only', // Always fetch data from network and update cache
  });
  const { edges, pageInfo } = comments || {};

  // append new data into previous data and update cache
  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

    return {
      ...previousResult,
      getComments: {
        ...previousResult.getComments,
        edges: [
          ...previousResult.getComments.edges,
          ...fetchMoreResult.getComments.edges,
        ],
        pageInfo: {
          ...fetchMoreResult.getComments.pageInfo,
        },
      },
    };
  };

  const handleChangeLoadMore = () => {
    // """Unpassed/Default Variables fetched from previous execution"""
    // we can pass new variables to fetchMore. otherwise, the query uses the same variables that it used in previous execution.
    fetchMore({ variables: { after: pageInfo.endCursor }, updateQuery }); // postId and first variables, will be fetched from previous execution(previous execution can be refetch or initial useQuery)
  };
  const handleChangeRefetch = () => {
    // """Unpassed/Default Variables are from useQuery"""
    // we can pass new variables to refech. otherwise, the query uses the same variables that it used in useQuery.
    refetch({});
  };

  return (
    <section className='comments-section'>
      <div className='comments-header'>
        <h1>Comments</h1>

        <div>
          <Button color='blue' floated='right' onClick={handleChangeRefetch}>
            Refetch Comments
          </Button>
        </div>
      </div>

      {loading && <div>'Loading...'</div>}
      {networkStatus === NetworkStatus.refetch && <div>'Refetching!'</div>}
      {networkStatus === NetworkStatus.fetchMore && (
        <div> 'Fetching More!'</div>
      )}

      {edges?.map(({ node }) => (
        <Card fluid key={node.id}>
          <Card.Content>
            {user && user.username === node.username && (
              <DeleteButton postId={id} commentId={node.id} />
            )}
            <Card.Header>{node.username}</Card.Header>
            <Card.Meta>{moment(node.createdAt).fromNow()}</Card.Meta>
            <Card.Description>{node.body}</Card.Description>
          </Card.Content>
        </Card>
      ))}
      <Button
        color='blue'
        floated='right'
        disabled={!pageInfo?.hasNextPage}
        onClick={handleChangeLoadMore}
      >
        Load More
      </Button>
    </section>
  );
};

export default Comments;
