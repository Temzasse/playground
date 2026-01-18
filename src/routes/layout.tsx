import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: Layout,
});

function Layout() {
  return (
    <div>
      <h1>Playground</h1>
      <nav>
        <ul>
          <li>
            <Link to="/query-suspense">Query Suspense</Link>
            <Link to="/apollo-suspense">Apollo Suspense</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
