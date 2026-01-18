import { useSuspenseQueryDeferred } from '@/data/react-query/hooks';
import { getRouteApi, Link } from '@tanstack/react-router';

const routeApi = getRouteApi('/_layout/states');

export function Sidebar() {
  const { statesQueryRef } = routeApi.useLoaderData();
  const { data } = useSuspenseQueryDeferred(statesQueryRef);

  return (
    <div
      style={{
        padding: 20,
        width: 200,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: 'calc(100vh - 80px)',
        overflow: 'auto',
      }}
    >
      <h3>States</h3>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data.map((state) => (
          <li key={state}>
            <Link
              to="/states/$state"
              params={{ state }}
              style={{
                appearance: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
                // fontWeight: state === selectedState ? 'bold' : 'normal',
              }}
            >
              {state}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
