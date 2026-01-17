import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
  component: IndexRoute,
});

function IndexRoute() {
  return <div>Index Route</div>;
}
