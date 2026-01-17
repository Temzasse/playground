import { useNavigate, useSearch } from '@tanstack/react-router';
import { useStatesQuery } from './queries';

export function Sidebar() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/query-suspense' });
  const { data } = useStatesQuery();
  const selectedState = searchParams.state;

  function handleSelect(value: string) {
    navigate({
      to: '/query-suspense',
      search: {
        state: value || undefined,
        page: 1,
        search: undefined,
        pageSize: searchParams.pageSize,
      },
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
