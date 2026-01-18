import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { SearchInput } from './search-input';
import { DataList } from './data-list';
import { queries } from './queries';

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  search: z.string().default(''),
});

export const Route = createFileRoute('/_layout/states/$state')({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({
    searchTerm: search.search,
    page: search.page,
    pageSize: search.pageSize,
  }),
  loader: async ({ context, params, deps }) => {
    const citiesQueryRef = queries.cities({
      state: params.state,
      searchTerm: deps.searchTerm,
      page: deps.page,
      pageSize: deps.pageSize,
    });

    void context.queryClient.prefetchQuery(citiesQueryRef);

    return { citiesQueryRef };
  },
});

function RouteComponent() {
  return (
    <>
      <h3>Cities</h3>
      <SearchInput />
      <DataList />
      <hr />
    </>
  );
}
