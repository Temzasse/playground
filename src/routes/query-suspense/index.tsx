import { useState } from 'react';

import { QueryBoundary } from '@/components/QueryBoundary';
import { SearchInput } from './SearchInput';
import { DataList } from './DataList';
import { Sidebar } from './Sidebar';

export function Component() {
  const [_, forceRender] = useState(0);
  const [latency, setLatency] = useState(0);

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
          <hr />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 12,
              backgroundColor: '#f5f5f5',
              borderRadius: 4,
              marginTop: 40,
            }}
          >
            <button onClick={() => forceRender((p) => p + 1)}>Re-render</button>

            <span>Extra latency {latency}ms</span>
            <input
              type="range"
              min={0}
              max={4000}
              step={100}
              value={latency}
              onChange={(e) => {
                setLatency(Number(e.target.value));
                (window as any).__LATENCY__ = Number(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </QueryBoundary>
  );
}
