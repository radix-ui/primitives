import * as React from 'react';

function useActionOptimisticState<T, U>(
  state: T,
  updateFn: (currentState: T, optimisticValue: U) => T,
  actionPropUsed: boolean,
  componentName: string,
  propName: string,
): [T, (optimisticValue: U) => void] {
  if (actionPropUsed) {
    assertReactActionVersion(componentName, propName);
  }

  const reactUseOptimistic = (React as any).useOptimistic as
    | undefined
    | ((
        passthrough: T,
        reducer: (currentState: T, optimisticValue: U) => T,
      ) => [T, (value: U) => void]);

  if (reactUseOptimistic) {
    return reactUseOptimistic(state, updateFn);
  }

  return [state, noop];
}

function runActionInTransition(
  action: () => void | PromiseLike<unknown>,
  onResolve: () => void,
  onReject: () => void,
) {
  const run = () => {
    try {
      const result = action();

      if (isPromiseLike(result)) {
        return result.then(onResolve, (error) => {
          onReject();
          throw error;
        });
      }

      onResolve();
    } catch (error) {
      onReject();
      throw error;
    }
  };

  if (typeof React.startTransition === 'function') {
    (React.startTransition as (scope: () => unknown) => void)(run);
  } else {
    void run();
  }
}

function noop() {}

function assertReactActionVersion(componentName: string, propName: string) {
  if (!supportsReactActionProps()) {
    throw new Error(
      `${componentName}: \`${propName}\` requires React 19.2 or newer because it uses React action and optimistic update semantics.`,
    );
  }
}

function supportsReactActionProps() {
  const [majorVersion = 0, minorVersion = 0] = React.version
    .split('.')
    .map((versionPart) => Number.parseInt(versionPart, 10));

  const versionSupportsActions = majorVersion > 19 || (majorVersion === 19 && minorVersion >= 2);

  return (
    versionSupportsActions &&
    typeof (React as any).useOptimistic === 'function' &&
    typeof React.startTransition === 'function'
  );
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

export { runActionInTransition, useActionOptimisticState };
