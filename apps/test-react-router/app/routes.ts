import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { primitives } from '@repo/test-registry';

export default [
  index('routes/page.tsx'),
  // Public APIs
  ...primitives.public.map((primitive) => route(primitive.id, `routes/${primitive.id}/page.tsx`)),
  // Internal APIs
  ...primitives.internal.map((primitive) => route(primitive.id, `routes/${primitive.id}/page.tsx`)),
] satisfies RouteConfig;
