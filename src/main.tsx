import { ApolloProvider } from '@apollo/client/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

import './index.css';
import { queryClient } from './data/react-query/client';
import { apolloClient } from './data/apollo-graphql/client';
import { router } from './route-setup';

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </QueryClientProvider>
);
