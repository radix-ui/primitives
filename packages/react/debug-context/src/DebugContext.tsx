import * as React from 'react';

type DebugContextType = {
  portalContainerRef?: React.RefObject<HTMLElement>;
  disableCollisionChecking?: boolean;
  disableLock?: boolean;
  viewportGap?: number;
};

const DebugContext = React.createContext<DebugContextType>({
  portalContainerRef: undefined,
  disableCollisionChecking: false,
  disableLock: false,
  viewportGap: undefined,
});
DebugContext.displayName = 'DebugContext';

type DebugContextProviderProps = DebugContextType & {
  children: React.ReactNode;
};

export function DebugContextProvider({ children, ...debugContext }: DebugContextProviderProps) {
  return <DebugContext.Provider value={debugContext}>{children}</DebugContext.Provider>;
}

export function useDebugContext() {
  return React.useContext(DebugContext);
}
