import { createFileRoute } from '@tanstack/react-router';
import { FILM_QUERY } from './queries';
import { useReadQueryDeferred } from '@/data/apollo-graphql/hooks';
import { readData } from '@/data/apollo-graphql/utils';

export const Route = createFileRoute('/_layout/films/$filmId')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const filmQueryRef = context.preloadQuery(FILM_QUERY, {
      variables: { filmId: params.filmId },
    });

    return { filmQueryRef };
  },
});

function RouteComponent() {
  const { filmQueryRef } = Route.useLoaderData();
  const query = useReadQueryDeferred(filmQueryRef);
  const { film } = readData(query);

  return (
    <div style={{ padding: 40 }}>
      <h3>
        [{film.episodeID}] {film.title}
      </h3>
      <p>
        <strong>Directed by:</strong> {film.director}
      </p>
      <p>
        <strong>Produced by:</strong> {film.producers.join(', ')}
      </p>
      <p>
        <strong>Release Date:</strong> {film.releaseDate}
      </p>
      <p>{film.openingCrawl}</p>
    </div>
  );
}
