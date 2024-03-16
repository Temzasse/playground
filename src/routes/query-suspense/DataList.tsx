import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCitiesQuery, State } from './hooks';
import { Pagination } from './Pagination';

export function DataList() {
  const [count, setCount] = useState(0);
  const [searchParams] = useSearchParams();
  const state = searchParams.get('state') as State | null;
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;
  const searchTerm = searchParams.get('search') || '';

  const { data, isPending } = useCitiesQuery({
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
      {isPending && <i>Loading...</i>}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cities.map((city) => (
          <li
            key={city}
            style={{
              backgroundColor: isPending ? 'lightgray' : 'transparent',
              opacity: isPending ? 0.5 : 1,
              padding: 2,
              borderRadius: 4,
            }}
          >
            {city}
          </li>
        ))}
      </ul>

      <Pagination total={total} />
      <strong>Total: {total}</strong>

      <hr />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: 12,
          backgroundColor: '#f5f5f5',
          borderRadius: 4,
          marginTop: 40,
        }}
      >
        <span>Count {count}</span>
        <button onClick={() => setCount((count) => count + 1)}>Increment</button>
      </div>
    </div>
  );
}
