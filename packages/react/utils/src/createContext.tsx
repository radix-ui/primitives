import * as React from 'react';

export function createContext<ContextValueType>(displayName: string, rootComponentName: string) {
  const Context = React.createContext<ContextValueType>(null as any);
  const useContext = (componentName: string) =>
    useContextOrThrow(Context, componentName, rootComponentName);
  Context.displayName = displayName;
  return [Context, useContext] as const;
}

export function useContextOrThrow<ContextValueType>(
  context: React.Context<ContextValueType>,
  componentName?: string,
  rootComponentName?: string
) {
  let contextValue = React.useContext(context);
  if (contextValue === null) {
    throw new Error(
      componentName && !rootComponentName
        ? `\`${componentName}\` attempted to use context outside of its root provider.`
        : !componentName && rootComponentName
        ? `A component attempted to use context outside of its root provider. This component must be used within \`${rootComponentName}\`.`
        : componentName && rootComponentName
        ? `\`${componentName}\` attempted to use context outside of its root provider. \`${componentName}\` must be used within \`${rootComponentName}\`.`
        : `A component attempted to use context outside of its root provider.`
    );
  }
  return contextValue;
}

export function useContextIfAvailable<ContextValueType>(context: React.Context<ContextValueType>) {
  try {
    return useContextOrThrow(context);
  } catch (e) {
    return null;
  }
}

export function useHasContext<ContextValueType>(
  context: React.Context<ContextValueType> | null | undefined
) {
  return useContextIfAvailable(context as any) ? true : false;
}
