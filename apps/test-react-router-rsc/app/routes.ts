import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { primitives } from '@repo/test-registry';

export default [
  index('routes/index.tsx'),
  // Public APIs
  ...primitives.public.map((primitive) => route(primitive.id, `routes/${primitive.id}.tsx`)),
  // Internal APIs
  ...primitives.internal.map((primitive) => route(primitive.id, `routes/${primitive.id}.tsx`)),
] satisfies RouteConfig;
