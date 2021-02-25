import * as React from 'react';

export function createContext<ContextValueType>(displayName: string, rootComponentName: string) {
  const Context = React.createContext<ContextValueType>(null as any);
  Context.displayName = displayName;
  function useContext(componentName: string) {
    const context = React.useContext(Context);
    if (context === null) {
      throw new Error(`\`${componentName}\` must be used within \`${rootComponentName}\``);
    }
    return context;
  }
  return [Context, useContext] as const;
}

export function createContextObj<ContextValueType extends object>(rootComponentName: string) {
  const Context = React.createContext<ContextValueType>(null as any);

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...providerProps } = props;
    const providerPropsString = JSON.stringify(providerProps);
    // Only re-memoize when stringified props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const context = React.useMemo(() => ({} as ContextValueType), [providerPropsString]);
    // mutate properties to ensure closures are up to date
    Object.entries(providerProps).forEach(([prop, value]) => ((context as any)[prop] = value));
    return <Context.Provider value={context}>{children}</Context.Provider>;
  }

  function useContext(componentName: string) {
    const context = React.useContext(Context);
    if (context === null) {
      throw new Error(`\`${componentName}\` must be used within \`${rootComponentName}\``);
    }
    return context;
  }

  Provider.displayName = rootComponentName + 'Provider';
  return [Provider, useContext] as const;
}
