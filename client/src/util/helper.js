import { PAGINATION_LIMIT } from './Constants';
import { FETCH_COMMENTS_QUERY } from './post/Graphql';

export const readCommentsCacheByPostId = ({ proxy, postId }) => {
  return proxy.readQuery({
    query: FETCH_COMMENTS_QUERY,
    variables: { postId, first: PAGINATION_LIMIT.COMMENTS },
  });
};

export const writeCommentsCacheByPostId = ({
  proxy,
  postId,
  updatedComments,
}) => {
  proxy.writeQuery({
    query: FETCH_COMMENTS_QUERY,
    data: updatedComments,
    variables: { postId, first: PAGINATION_LIMIT.COMMENTS },
  });
};
