import * as React from 'react';

// Use null as initial value to handle SSR safely
const DocumentContext = React.createContext<Document | null>(null);

interface DocumentProviderProps {
  document?: Document;
  children: React.ReactNode;
}

export function DocumentProvider({ document: doc, children }: DocumentProviderProps) {
  const value = React.useMemo(
    () => doc ?? (typeof document !== 'undefined' ? document : null),
    [doc]
  );
  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

export function useDocument() {
  const doc = React.useContext(DocumentContext);
  // Return default document if available and no context value
  return doc ?? (typeof document !== 'undefined' ? document : null);
}

// For components that absolutely need a document
export function useDocumentStrict() {
  const doc = useDocument();
  if (!doc) {
    throw new Error(
      '`useDocumentStrict` must be used within a `DocumentProvider` or in a browser environment'
    );
  }
  return doc;
}

type PropsWithDocument = { document?: Document };

// Fixed HOC with proper type handling
export function withDocument<P extends PropsWithDocument, R = unknown>(
  Component: React.ComponentType<P>
) {
  const WithDocument = React.forwardRef<R, Omit<P, 'document'>>((props, ref) => {
    const document = useDocument();
    return <Component {...(props as any)} ref={ref} document={document || undefined} />;
  });

  WithDocument.displayName = `WithDocument(${Component.displayName || Component.name || 'Component'})`;
  return WithDocument;
}
