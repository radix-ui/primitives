/// <reference types="node" />
/// <reference types="@testing-library/react" />
/// <reference types="vitest-axe/extend-expect" />
/// <reference path="../../../scripts/setup-tests.ts" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

/**
 * Asserts that every optional property of `T` accepts an explicit `undefined`,
 * as `exactOptionalPropertyTypes` requires of a public props type. Consumers
 * routinely forward a `T | undefined` variable straight into a prop
 * (`<Dialog.Root open={maybeOpen}>`), which `open?: boolean` rejects and
 * `open?: boolean | undefined` accepts.
 *
 * Use it in a package's `*.test-d.ts`, one line per exported props type:
 *
 * ```ts
 * type _Dialog = AssertOptionalPropsAcceptUndefined<DialogProps>;
 * ```
 *
 * A violation fails `pnpm typecheck` naming the offending prop:
 *
 * ```
 * error TS2344: Type 'DialogProps' does not satisfy the constraint '{ ... }'.
 *   Types of property 'modal' are incompatible.
 *     Type 'boolean' is not assignable to type 'never'.
 * ```
 *
 * The constraint maps every offending prop to `never`, so only a `T` whose
 * optional props all accept `undefined` satisfies it. The check cannot be
 * written as `undefined extends T[K]`: an indexed access on an optional
 * property always yields `| undefined`, even under `exactOptionalPropertyTypes`.
 * Instead `object extends Pick<T, K>` asks "is `K` optional?" (an object
 * missing `K` is still assignable), and `Record<K, undefined> extends
 * Pick<T, K>` asks "does `K` accept an explicit `undefined`?".
 */
type AssertOptionalPropsAcceptUndefined<
  T extends {
    [K in keyof T]: object extends Pick<T, K>
      ? Record<K, undefined> extends Pick<T, K>
        ? T[K]
        : never
      : T[K];
  },
> = T;
