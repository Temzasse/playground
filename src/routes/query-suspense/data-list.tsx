import { useSearch } from '@tanstack/react-router';

import { useCitiesQuery } from './queries';
import { Pagination } from './Pagination';

export function DataList() {
  const searchParams = useSearch({ from: '/query-suspense' });
  const state = searchParams.state;
  const page = searchParams.page || 1;
  const pageSize = searchParams.pageSize || 20;
  const searchTerm = searchParams.search || '';

  const { data, isSuspending } = useCitiesQuery({
    state,
    page,
    pageSize,
    searchTerm,
  });

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
