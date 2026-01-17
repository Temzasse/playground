import { ChangeEvent } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

export function SearchInput() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/query-suspense' });

  function handleChange({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    navigate({
      to: '/query-suspense',
      search: {
        ...searchParams,
        page: 1,
        search: value || undefined,
      },
    });
  }

  return (
    <input
      value={searchParams.search || ''}
      onChange={handleChange}
      placeholder="Search cities"
    />
  );
}
