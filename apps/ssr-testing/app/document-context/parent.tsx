'use client';
import * as React from 'react';
import { DocumentContext } from 'radix-ui/internal';

export function Parent({ children }: { children: React.ReactNode }) {
  const [document, setDocument] = React.useState<Document | null>(null);
  React.useEffect(() => {
    console.log(document);
  }, [document]);
  return (
    <DocumentContext.DocumentProvider document={document}>
      {children}
      <div>
        <iframe
          onLoad={(event) => {
            const iframeDocument = event.currentTarget.contentDocument;
            setDocument(iframeDocument);
          }}
          title="Radix UI webiste"
          src="https://www.radix-ui.com"
          style={{
            width: '100%',
            height: '1000px',
          }}
        />
      </div>
    </DocumentContext.DocumentProvider>
  );
}
