import { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

export function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleChange({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    setSearchParams((params) => {
      params.set('page', '1');

      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      return params;
    });
  }

  return (
    <input
      value={searchParams.get('search') || ''}
      onChange={handleChange}
      placeholder="Search cities"
    />
  );
}
