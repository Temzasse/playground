import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

type RouterContext = {
  apolloClient: any;
  queryClient: any;
  preloadQuery: any;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
