import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL || 'http://localhost:3100/graphql';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: backendUrl, credentials: 'include' }),
  cache: new InMemoryCache(),
});
