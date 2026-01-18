import { createFileRoute } from '@tanstack/react-router';

import { graphql } from '@/gql';
import { useSuspenseQueryDeferred } from '@/data/apollo-graphql/hooks';
import { readData } from '@/data/apollo-graphql/utils';

export const Route = createFileRoute('/_layout/apollo-suspense')({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useSuspenseQueryDeferred(ALL_FILMS_QUERY);
  const data = readData(query);

  return (
    <div style={{ padding: 40 }}>
      <h3>Films</h3>
      <ul>
        {data.allFilms.films.map((film) => (
          <li key={film.title}>{film.title}</li>
        ))}
      </ul>
    </div>
  );
}

const ALL_FILMS_QUERY = graphql(`
  query AllFilms {
    allFilms {
      films {
        title
      }
    }
  }
`);
