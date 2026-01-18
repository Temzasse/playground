import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { useState } from 'react';
import { z } from 'zod';

import { Sidebar } from './sidebar';
import { SearchInput } from './search-input';
import { DataList } from './data-list';
import { queries } from './queries';

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  state: z.string().default(''),
  search: z.string().default(''),
});

export const Route = createFileRoute('/_layout/query-suspense')({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({
    state: search.state,
    searchTerm: search.search,
    page: search.page,
    pageSize: search.pageSize,
  }),
  loader: async ({ context, deps }) => {
    const statesOptions = queries.states();
    const citiesOptions = queries.cities({
      state: deps.state || null,
      searchTerm: deps.searchTerm,
      page: deps.page,
      pageSize: deps.pageSize,
    });

    void context.queryClient.prefetchQuery(statesOptions);
    void context.queryClient.prefetchQuery(citiesOptions);

    return { statesOptions, citiesOptions };
  },
});

function RouteComponent() {
  const [_, forceRender] = useState(0);
  const [latency, setLatency] = useState(200);

  return (
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
          <span>Latency {latency}ms</span>
          <input
            type="range"
            min={200}
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
  );
}
