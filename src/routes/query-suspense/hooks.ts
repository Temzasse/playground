import { queryOptions } from '@tanstack/react-query';

import { sleep } from '@/utils';
import { useSuspenseQueryDeferred } from '@/query-utils';

type CitiesParams = {
  state: string | null;
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
  const data = await fetchData();
  return Object.keys(data);
}

async function fetchCities(params: CitiesParams) {
  // if (Math.random() < 0.5) {
  //   throw new Error('Random error');
  // }

  const data = await fetchData();

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const baseCities = params.state ? data[params.state] : Object.values(data).flat();
  const filteredCities = baseCities.filter((city) =>
    city.name.toLowerCase().includes(params.searchTerm.toLowerCase())
  );
  const paginatedCities = filteredCities.slice(start, end);

  return {
    cities: paginatedCities,
    total: filteredCities.length,
  };
}

async function fetchData(): Promise<Record<string, Array<{ name: string; state: string }>>> {
  const latency = (window as any).__LATENCY__ || 0;

  await sleep(latency);

  const data = (await fetch('/data.json').then((res) => res.json())) as Record<string, string[]>;

  return Object.fromEntries(
    Object.entries(data).map(
      ([state, cities]) => [state, cities.map((name) => ({ name, state }))] as const
    )
  );
}
