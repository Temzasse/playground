import { useSearchParams } from 'react-router-dom';

export function Pagination({ total }: { total: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;

  function handlePrev() {
    setSearchParams((params) => {
      params.set('page', Math.max(page - 1, 1).toString());
      return params;
    });
  }

  function handleNext() {
    setSearchParams((params) => {
      params.set('page', Math.min(page + 1, Math.ceil(total / pageSize)).toString());
      return params;
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button disabled={page === 1} onClick={handlePrev}>
        Previous
      </button>
      <span
        style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 4,
          backgroundColor: 'lightgray',
        }}
      >
        {page}
      </span>
      <button disabled={page === Math.ceil(total / pageSize)} onClick={handleNext}>
        Next
      </button>
    </div>
  );
}
