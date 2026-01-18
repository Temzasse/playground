import { graphql } from '@/gql';

export const ALL_FILMS_QUERY = graphql(`
  query AllFilms {
    allFilms {
      films {
        id
        title
        episodeID
      }
    }
  }
`);

export const FILM_QUERY = graphql(`
  query Film($filmId: ID!) {
    film(id: $filmId) {
      id
      title
      episodeID
      director
      releaseDate
      openingCrawl
      producers
    }
  }
`);
