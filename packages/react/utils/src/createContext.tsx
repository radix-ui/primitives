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
    const value = React.useMemo(() => providerProps, [providerProps]) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
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
