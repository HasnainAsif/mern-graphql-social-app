import React, { useContext, useState } from 'react';
import DeleteButton from '../../components/DeleteButton';
import { Button, Card, Dropdown } from 'semantic-ui-react';
import { AuthContext } from '../../util/context/auth';
import moment from 'moment';
import { usePagination } from '../../util/hooks';
import { PAGINATION_SIDE, PAGINATION_TYPE } from '../../util/Constants';
import { useQuery } from '@apollo/client';
import { FETCH_COMMENTS_QUERY } from '../../util/post/Graphql';

const Comments = ({ commentCount, postId: id }) => {
  const { user } = useContext(AuthContext);

  const {
    loading,
    data: { getComments: comments } = {}, // setting default value, because initially data is undefined when loading is true
    error,
    fetchMore,
  } = useQuery(FETCH_COMMENTS_QUERY, { variables: { postId: id, first: 2 } });
  const { edges, pageInfo } = comments || {};

  // const { handleChangeScreenNo, pageNo, lastPage, paginatedData } =
  //   usePagination({ data: comments });

  // const [paginationSide, setPaginationSide] = useState(
  //   PAGINATION_SIDE.FRONTEND
  // );

  // const onChangePaginationSide = (e, { value }) => {
  //   setPaginationSide(value);
  // };

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
    fetchMore({ variables: { after: pageInfo.endCursor }, updateQuery });
  };

  return (
    <section className='comments-section'>
      <div className='comments-header'>
        <h1>Comments</h1>
        {/* {!!commentCount && (
          <div>
            <Dropdown
              fluid
              defaultValue={PAGINATION_SIDE.FRONTEND}
              selection
              onChange={onChangePaginationSide}
              options={[
                {
                  key: 'fp',
                  value: PAGINATION_SIDE.FRONTEND,
                  text: 'Frontend pagination',
                },
                {
                  key: 'bp',
                  value: PAGINATION_SIDE.BACKEND,
                  text: 'Backend pagination',
                },
              ]}
            />
          </div>
        )} */}
      </div>
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
