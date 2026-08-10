import { createContext, createContextScope } from './index';
import type {
  CreateScopedContext,
  UseAssertedContext,
  UseAssertedScopedContext,
  UseContext,
  UseScopedContext,
} from './index';

type Value = { presets: boolean };

// `createContext` returns a hook typed with named interfaces that must be
// exported from the package entry. When they are missing, tsc cannot name the
// inferred type of a re-exported hook in declaration output (TS4023). See
// https://github.com/radix-ui/primitives/issues/4098.
const [PresetsProvider, usePresets] = createContext<Value>('Presets', { presets: true });
const [OptionalProvider, useOptional] = createContext<Value>('Optional');

// Guard that the exported interfaces match the actual hook types.
const _assertUsePresets: UseAssertedContext<Value> = usePresets;
const _assertUseOptional: UseContext<Value> = useOptional;

const [createScopedContext, createScope] = createContextScope('Scoped');
const [ScopedProvider, useScoped] = createScopedContext<Value>('Scoped', { presets: true });

const _assertCreateScopedContext: CreateScopedContext = createScopedContext;
const _assertUseScoped: UseAssertedScopedContext<Value> = useScoped;
const _assertUseScopedOptional: UseScopedContext<Value> = createScopedContext<Value>('Scoped')[1];

export {
  PresetsProvider,
  OptionalProvider,
  ScopedProvider,
  createScope,
  usePresets,
  useOptional,
  useScoped,
};
