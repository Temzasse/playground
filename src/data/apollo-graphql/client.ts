import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { createQueryPreloader } from '@apollo/client/react';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'https://swapi-graphql.netlify.app/graphql' }),
  cache: new InMemoryCache(),
});

export const preloadQuery = createQueryPreloader(apolloClient);
