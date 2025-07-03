import * as React from 'react';
import { useIsHydrated } from '@radix-ui/react-use-is-hydrated';

// Use null as initial value to handle SSR safely
const DocumentContext = React.createContext<Document | null>(null);
DocumentContext.displayName = 'DocumentContext';

interface DocumentProviderProps {
  document: Document | null;
  children: React.ReactNode;
}

export function DocumentProvider({ document, children }: DocumentProviderProps) {
  return <DocumentContext.Provider value={document}>{children}</DocumentContext.Provider>;
}

export function useDocument() {
  const document = React.useContext(DocumentContext);
  const isHydrated = useIsHydrated();
  return document ?? (isHydrated ? globalThis.document : null);
}
