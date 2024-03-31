import { useSearchParams } from 'react-router-dom';
import { useStatesQuery } from './hooks';

export function Sidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useStatesQuery();
  const selectedState = searchParams.get('state');

  function handleSelect(value: string) {
    setSearchParams((params) => {
      if (!value) {
        params.delete('state');
      } else {
        params.set('state', value);
      }

      params.set('page', '1');
      params.delete('search');

      return params;
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
