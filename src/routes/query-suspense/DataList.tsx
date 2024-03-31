import { useSearchParams } from 'react-router-dom';

import { useCitiesQuery } from './hooks';
import { Pagination } from './Pagination';

export function DataList() {
  const [searchParams] = useSearchParams();
  const state = searchParams.get('state');
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;
  const searchTerm = searchParams.get('search') || '';

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
                backgroundColor: isSuspending ? 'lightgray' : 'transparent',
                opacity: isSuspending ? 0.5 : 1,
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
