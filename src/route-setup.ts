import { createRouter } from '@tanstack/react-router';

import { apolloClient, preloadQuery } from './data/apollo-graphql/client';
import { queryClient } from './data/react-query/client';
import { routeTree } from './route-tree.gen';
import { RouteError } from './route-error';
import { RoutePending } from './route-pending';

export const router = createRouter({
  routeTree,
  context: { queryClient, apolloClient, preloadQuery },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: RouteError,
  defaultPendingComponent: RoutePending,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
