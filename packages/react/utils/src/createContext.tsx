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
