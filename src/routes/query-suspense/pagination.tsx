import { useNavigate, useSearch } from '@tanstack/react-router';

export function Pagination({ total }: { total: number }) {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/query-suspense' });
  const page = searchParams.page || 1;
  const pageSize = searchParams.pageSize || 20;

  function handlePrev() {
    navigate({
      to: '/query-suspense',
      search: {
        ...searchParams,
        page: Math.max(page - 1, 1),
      },
    });
  }

  function handleNext() {
    navigate({
      to: '/query-suspense',
      search: {
        ...searchParams,
        page: Math.min(page + 1, Math.ceil(total / pageSize)),
      },
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
      <button
        disabled={page === Math.ceil(total / pageSize)}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
