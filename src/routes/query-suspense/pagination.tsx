import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/_layout/states/$state');

export function Pagination({ total }: { total: number }) {
  const navigate = routeApi.useNavigate();
  const { page, pageSize } = routeApi.useSearch();

  function handlePrev() {
    navigate({
      search: (prev) => ({
        ...prev,
        page: Math.max(page - 1, 1),
      }),
    });
  }

  function handleNext() {
    navigate({
      search: (prev) => ({
        ...prev,
        page: Math.min(page + 1, Math.ceil(total / pageSize)),
      }),
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
