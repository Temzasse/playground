import { getRouteApi } from '@tanstack/react-router';

import { Pagination } from './pagination';
import { useSuspenseQueryDeferred } from '@/data/react-query/hooks';

const routeApi = getRouteApi('/_layout/query-suspense');

export function DataList() {
  const { citiesOptions } = routeApi.useLoaderData();
  const { data, isSuspending } = useSuspenseQueryDeferred(citiesOptions);
  const { cities, total } = data;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {isSuspending && <i>Loading...</i>}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cities.map((city) => {
          return (
            <li
              key={`${city.name}-${city.state}`}
              style={{
                backgroundColor: isSuspending ? '#eee' : 'transparent',
                color: isSuspending ? 'transparent' : 'black',
                padding: 2,
                borderRadius: 4,
              }}
            >
              {city.name}
            </li>
          );
        })}
      </ul>

      <Pagination total={total} />
      <strong>Total: {total}</strong>
    </div>
  );
}
