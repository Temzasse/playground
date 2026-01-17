import { createFileRoute } from '@tanstack/react-router';

import { Floorball } from './floorball';

export const Route = createFileRoute('/_layout/floorball')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Floorball />;
}
