import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render } from '@testing-library/react';
import { DirectionProvider, useDirection } from './direction';
import { afterEach, describe, it, beforeEach, expect } from 'vitest';

// Helper component that renders the resolved direction as text
function DirectionDisplay({ localDir }: { localDir?: 'ltr' | 'rtl' }) {
  const direction = useDirection(localDir);
  return <span data-testid="direction">{direction}</span>;
}

describe('useDirection', () => {
  let rendered: RenderResult;

  afterEach(() => {
    cleanup();
    // Reset document dir after each test
    document.documentElement.dir = '';
  });

  describe('given no DirectionProvider and no local dir', () => {
    describe('when document dir is not set', () => {
      beforeEach(() => {
        document.documentElement.dir = '';
        rendered = render(<DirectionDisplay />);
      });

      it('should default to ltr', () => {
        expect(rendered.getByTestId('direction').textContent).toBe('ltr');
      });
    });

    describe('when document dir is rtl', () => {
      beforeEach(() => {
        document.documentElement.dir = 'rtl';
        rendered = render(<DirectionDisplay />);
      });

      it('should return rtl from document', () => {
        expect(rendered.getByTestId('direction').textContent).toBe('rtl');
      });
    });

    describe('when document dir is ltr', () => {
      beforeEach(() => {
        document.documentElement.dir = 'ltr';
        rendered = render(<DirectionDisplay />);
      });

      it('should return ltr from document', () => {
        expect(rendered.getByTestId('direction').textContent).toBe('ltr');
      });
    });
  });

  describe('given a DirectionProvider with dir="rtl"', () => {
    describe('when document dir is ltr', () => {
      beforeEach(() => {
        document.documentElement.dir = 'ltr';
        rendered = render(
          <DirectionProvider dir="rtl">
            <DirectionDisplay />
          </DirectionProvider>,
        );
      });

      it('should return rtl from provider (overrides document)', () => {
        expect(rendered.getByTestId('direction').textContent).toBe('rtl');
      });
    });
  });

  describe('given a DirectionProvider with dir="ltr"', () => {
    describe('when document dir is rtl', () => {
      beforeEach(() => {
        document.documentElement.dir = 'rtl';
        rendered = render(
          <DirectionProvider dir="ltr">
            <DirectionDisplay />
          </DirectionProvider>,
        );
      });

      it('should return ltr from provider (overrides document)', () => {
        expect(rendered.getByTestId('direction').textContent).toBe('ltr');
      });
    });
  });

  describe('given a local dir prop', () => {
    describe('when DirectionProvider is rtl and document is rtl', () => {
      beforeEach(() => {
        document.documentElement.dir = 'rtl';
        rendered = render(
          <DirectionProvider dir="rtl">
            <DirectionDisplay localDir="ltr" />
          </DirectionProvider>,
        );
      });

      it('should return ltr from local dir (highest priority)', () => {
        expect(rendered.getByTestId('direction').textContent).toBe('ltr');
      });
    });
  });
});
