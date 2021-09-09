import * as React from 'react';

function createContext<ContextValueType extends object | undefined>(
  groupName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType>(defaultContext as any);

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...providerProps } = props;
    // Only re-memoize when prop values change
    const value = React.useMemo(
      () => providerProps,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(providerProps)
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(partName: string) {
    const context = React.useContext(Context);
    if (!defaultContext && context === undefined) {
      throw new Error(`\`${partName}\` must be used within \`${groupName}\``);
    }
    return context;
  }

  Provider.displayName = groupName + 'Provider';
  return [Provider, useContext] as const;
}

export { createContext };
