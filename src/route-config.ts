import { rootRoute, route, index, layout } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('root.tsx', [
  layout('layout.tsx', [
    index('index.tsx'),
    route('/floorball', 'floorball/floorball.route.tsx'),
    route('/query-suspense', 'query-suspense/query-suspense.route.tsx'),
    route('/apollo-suspense', 'apollo-suspense/apollo-suspense.route.tsx'),
  ]),
]);
