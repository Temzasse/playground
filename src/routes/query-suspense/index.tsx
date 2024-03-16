import { QueryBoundary } from '@/components/QueryBoundary';
import { SearchInput } from './SearchInput';
import { DataList } from './DataList';
import { Sidebar } from './Sidebar';

export function Component() {
  return (
    <QueryBoundary>
      <div
        style={{
          padding: 40,
          display: 'flex',
          gap: 16,
        }}
      >
        <Sidebar />
        <div
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'start',
          }}
        >
          <h3>Cities</h3>
          <SearchInput />
          <DataList />
        </div>
      </div>
    </QueryBoundary>
  );
}
