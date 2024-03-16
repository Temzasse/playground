import { queryOptions } from '@tanstack/react-query';

import data from './data.json';
import { sleep } from '@/utils';
import { useSuspenseQueryDeferred } from '@/query-utils';

export type State = keyof typeof data;

type CitiesParams = {
  state: State | null;
  searchTerm: string;
  page: number;
  pageSize: number;
};

// Options

export const queries = {
  states: () =>
    queryOptions({
      queryKey: ['states'],
      queryFn: fetchStates,
    }),
  cities: (params: CitiesParams) =>
    queryOptions({
      queryKey: ['cities', params],
      queryFn: () => fetchCities(params),
    }),
};

// Queries

export function useStatesQuery() {
  return useSuspenseQueryDeferred(queries.states());
}

export function useCitiesQuery(params: CitiesParams) {
  return useSuspenseQueryDeferred(queries.cities(params));
}

// Fetchers

async function fetchStates() {
  await sleep(2000);
  return Object.keys(data);
}

async function fetchCities(params: CitiesParams) {
  await sleep(2000);

  // if (Math.random() < 0.5) {
  //   throw new Error('Random error');
  // }

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const baseCities = params.state ? data[params.state] : Object.values(data).flat();
  const filteredCities = baseCities.filter((city) =>
    city.toLowerCase().includes(params.searchTerm.toLowerCase())
  );
  const paginatedCities = filteredCities.slice(start, end);

  return {
    cities: paginatedCities,
    total: filteredCities.length,
  };
}
