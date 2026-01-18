import { ChangeEvent } from 'react';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/_layout/states/$state');

export function SearchInput() {
  const navigate = routeApi.useNavigate();
  const { search } = routeApi.useSearch();

  function handleChange({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    navigate({
      search: (prev) => ({ ...prev, search: value, page: 1 }),
    });
  }

  return (
    <input
      value={search || ''}
      onChange={handleChange}
      placeholder="Search cities"
    />
  );
}
