import * as React from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
// Use null as initial value to handle SSR safely
const DocumentContext = React.createContext<Document | null>(null);

interface DocumentProviderProps {
  document: Document;
  children: React.ReactNode;
}

export function DocumentProvider({ document, children }: DocumentProviderProps) {
  return <DocumentContext.Provider value={document}>{children}</DocumentContext.Provider>;
}

const subscribe = () => () => {};

export function useDocument() {
  const doc = React.useContext(DocumentContext);
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  return doc ?? (isHydrated ? document : null);
}
