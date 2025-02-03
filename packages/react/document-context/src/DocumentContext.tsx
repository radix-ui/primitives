import * as React from 'react';

// Use null as initial value to handle SSR safely
const DocumentContext = React.createContext<Document | null>(null);

interface DocumentProviderProps {
  document?: Document;
  children: React.ReactNode;
}

export function DocumentProvider({ document: doc, children }: DocumentProviderProps) {
  const value = React.useMemo(
    () => doc ?? (typeof document !== 'undefined' ? globalThis?.document : null),
    [doc]
  );
  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

export function useDocument() {
  const doc = React.useContext(DocumentContext);
  // Return default document if available and no context value
  return doc ?? (typeof document !== 'undefined' ? globalThis?.document : null);
}
