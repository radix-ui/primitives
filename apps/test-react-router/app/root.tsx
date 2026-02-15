import {
  isRouteErrorResponse,
  NavLink,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { primitives } from '@repo/test-registry';
import type { Route } from './+types/root';
import './globals.css';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>React Router testing</h1>
        <div style={{ display: 'flex', gap: '10em' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
            <h2>Public APIs</h2>
            {primitives.public.map((primitive) => (
              <NavLink key={primitive.id} to={`/${primitive.id}`}>
                {primitive.name}
              </NavLink>
            ))}
            <hr />
            <h2>Internal APIs</h2>
            {primitives.internal.map((primitive) => (
              <NavLink key={primitive.id} to={`/${primitive.id}`}>
                {primitive.name}
              </NavLink>
            ))}
          </div>
          <div>{children}</div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
