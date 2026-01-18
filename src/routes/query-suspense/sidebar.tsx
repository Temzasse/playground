import { useSuspenseQueryDeferred } from '@/data/react-query/hooks';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/_layout/query-suspense');

export function Sidebar() {
  const navigate = routeApi.useNavigate();
  const { state: selectedState } = routeApi.useSearch();
  const { statesOptions } = routeApi.useLoaderData();
  const { data } = useSuspenseQueryDeferred(statesOptions);

  function handleSelect(value: string) {
    navigate({
      search: (prev) => ({ ...prev, state: value, page: 1 }),
    });
  }

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
        <li>
          <button
            onClick={() => handleSelect('')}
            style={{
              appearance: 'none',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
              fontWeight: !selectedState ? 'bold' : 'normal',
            }}
          >
            All
          </button>
        </li>
        {data.map((state) => (
          <li key={state}>
            <button
              onClick={() => handleSelect(state)}
              style={{
                appearance: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
                fontWeight: state === selectedState ? 'bold' : 'normal',
              }}
            >
              {state}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
