import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

import { useReadQueryDeferred } from '@/data/apollo-graphql/hooks';
import { readData } from '@/data/apollo-graphql/utils';
import { ALL_FILMS_QUERY } from './queries';

export const Route = createFileRoute('/_layout/films')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const allFilmsQueryRef = context.preloadQuery(ALL_FILMS_QUERY);

    return { allFilmsQueryRef };
  },
});

function RouteComponent() {
  const { allFilmsQueryRef } = Route.useLoaderData();
  const query = useReadQueryDeferred(allFilmsQueryRef);
  const data = readData(query);

  return (
    <div style={{ padding: 40 }}>
      <h3>Films</h3>
      <ul>
        {data.allFilms.films
          .slice()
          .sort((a, b) => a.episodeID - b.episodeID)
          .map((film) => (
            <li key={film.title}>
              <Link to="/films/$filmId" params={{ filmId: film.id }}>
                [{film.episodeID}] {film.title}
              </Link>
            </li>
          ))}
      </ul>

      <Outlet />
    </div>
  );
}
