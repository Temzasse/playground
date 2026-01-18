import { rootRoute, route, index, layout } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('root.tsx', [
  layout('layout.tsx', [
    index('index.tsx'),
    route('/states', 'query-suspense/states.route.tsx', [
      index('query-suspense/states-index.route.tsx'),
      route('$state', 'query-suspense/cities.route.tsx'),
    ]),
    route('/films', 'apollo-suspense/films.route.tsx', [
      index('apollo-suspense/films-index.route.tsx'),
      route('$filmId', 'apollo-suspense/film.route.tsx'),
    ]),
  ]),
]);
