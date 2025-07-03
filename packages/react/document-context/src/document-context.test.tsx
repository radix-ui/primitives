import { render, screen } from '@testing-library/react';
import { DocumentProvider, useDocument } from './document-context';
import { describe, it, expect } from 'vitest';

// Test component that uses the document context
function TestComponent() {
  const doc = useDocument();
  return <div>Has document: {doc ? 'true' : 'false'}</div>;
}

describe('DocumentContext', () => {
  it('provides custom document when specified', () => {
    const mockDocument = {} as Document;

    function TestDocumentConsumer() {
      const doc = useDocument();
      return <div>{doc === mockDocument ? 'custom document' : 'default document'}</div>;
    }

    render(
      <DocumentProvider document={mockDocument}>
        <TestDocumentConsumer />
      </DocumentProvider>
    );

    expect(screen.getByText('custom document')).toBeInTheDocument();
  });

  it('can be nested with different documents', () => {
    const mockDocument1 = { id: 1 } as unknown as Document;
    const mockDocument2 = { id: 2 } as unknown as Document;

    function TestDocumentConsumer() {
      const doc = useDocument();
      return <div>Document ID: {(doc as any).id}</div>;
    }

    render(
      <DocumentProvider document={mockDocument1}>
        <div>
          <TestDocumentConsumer />
          <DocumentProvider document={mockDocument2}>
            <TestDocumentConsumer />
          </DocumentProvider>
        </div>
      </DocumentProvider>
    );

    expect(screen.getByText('Document ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Document ID: 2')).toBeInTheDocument();
  });

  it('useDocument returns global document when no value is passed to provider', () => {
    function TestDocumentConsumer() {
      const doc = useDocument();
      return <div>{doc === globalThis.document ? 'global document' : 'other document'}</div>;
    }

    render(<TestDocumentConsumer />);

    expect(screen.getByText('global document')).toBeInTheDocument();
  });

  it('useDocument returns default document when custom document is not provided', () => {
    render(<TestComponent />);

    expect(screen.getByText('Has document: true')).toBeInTheDocument();
  });
});
