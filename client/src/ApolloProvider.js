import React from "react";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

const authorizationLink = setContext((request, previousContext) => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: { Authorization: token ? `Bearer ${token}` : `` },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const client = new ApolloClient({
  // uri: authorizationLink.concat("http://localhost:5000"),
  link: authorizationLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
