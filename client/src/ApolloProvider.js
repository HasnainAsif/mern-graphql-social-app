import React from 'react';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      // do something with graphql error.
      // we can add toast errors
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      // do something with network error
      // we can add toast errors
      console.log(`[Network error]: ${networkError}`);
    }
  }
);

const link = () => {
  const authorizationLink = setContext((request, previousContext) => {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: { Authorization: token ? `Bearer ${token}` : `` },
    };
  });
  const httpLink = createHttpLink({
    uri: 'http://localhost:5000',
  });

  const authenticatedLink = authorizationLink.concat(httpLink); // if we donot need errorLink, it can also be returned
  return ApolloLink.from([errorLink, authenticatedLink]); // httpLink is terminating link and it must be in last.
};

const client = new ApolloClient({
  link: link(),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
