import type { ApolloClient } from '@apollo/client';
import type { PreloadQueryFunction } from '@apollo/client/react';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

type RouterContext = {
  apolloClient: ApolloClient;
  preloadQuery: PreloadQueryFunction;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
