import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { Root } from './Root';
import { queryClient } from './query-client';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'query-suspense',
        lazy: () => import('./routes/query-suspense'),
      },
      {
        path: 'defer-expensive',
        lazy: () => import('./routes/defer-expensive'),
      },
      {
        path: 'floorball',
        lazy: () => import('./routes/floorball'),
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
