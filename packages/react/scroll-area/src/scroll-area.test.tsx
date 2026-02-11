import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as ScrollArea from './scroll-area';

const VIEWPORT_TEST_ID = 'scroll-area-viewport';
const CONTENT_TEXT = 'Scroll content';

const ScrollAreaTest = (props: {
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
}) => (
  <ScrollArea.Root type="always" style={{ width: 200, height: 200 }}>
    <ScrollArea.Viewport data-testid={VIEWPORT_TEST_ID} contentProps={props.contentProps}>
      <div>{CONTENT_TEXT}</div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
);

describe('ScrollArea', () => {
  afterEach(cleanup);

  describe('given a default ScrollArea', () => {
    it('should render content inside the viewport', () => {
      const rendered = render(<ScrollAreaTest />);
      expect(rendered.getByText(CONTENT_TEXT)).toBeInTheDocument();
    });

    it('should render the internal content wrapper with default display: table', () => {
      const rendered = render(<ScrollAreaTest />);
      const viewport = rendered.getByTestId(VIEWPORT_TEST_ID);
      const contentWrapper = viewport.firstElementChild as HTMLElement;
      expect(contentWrapper).toBeTruthy();
      expect(contentWrapper.style.display).toBe('table');
      expect(contentWrapper.style.minWidth).toBe('100%');
    });
  });

  describe('given contentProps', () => {
    it('should forward style overrides to the content wrapper', () => {
      const rendered = render(
        <ScrollAreaTest
          contentProps={{ style: { display: 'flex', flexDirection: 'column' } }}
        />
      );
      const viewport = rendered.getByTestId(VIEWPORT_TEST_ID);
      const contentWrapper = viewport.firstElementChild as HTMLElement;
      expect(contentWrapper.style.display).toBe('flex');
      expect(contentWrapper.style.flexDirection).toBe('column');
      // minWidth should still be present as a base style
      expect(contentWrapper.style.minWidth).toBe('100%');
    });

    it('should forward className to the content wrapper', () => {
      const rendered = render(
        <ScrollAreaTest contentProps={{ className: 'custom-content' }} />
      );
      const viewport = rendered.getByTestId(VIEWPORT_TEST_ID);
      const contentWrapper = viewport.firstElementChild as HTMLElement;
      expect(contentWrapper.classList.contains('custom-content')).toBe(true);
    });

    it('should forward data attributes to the content wrapper', () => {
      const rendered = render(
        <ScrollAreaTest contentProps={{ 'data-slot': 'content' } as any} />
      );
      const viewport = rendered.getByTestId(VIEWPORT_TEST_ID);
      const contentWrapper = viewport.firstElementChild as HTMLElement;
      expect(contentWrapper.getAttribute('data-slot')).toBe('content');
    });

    it('should allow overriding only display while preserving minWidth', () => {
      const rendered = render(
        <ScrollAreaTest contentProps={{ style: { display: 'block' } }} />
      );
      const viewport = rendered.getByTestId(VIEWPORT_TEST_ID);
      const contentWrapper = viewport.firstElementChild as HTMLElement;
      expect(contentWrapper.style.display).toBe('block');
      expect(contentWrapper.style.minWidth).toBe('100%');
    });

    it('should allow overriding minWidth', () => {
      const rendered = render(
        <ScrollAreaTest contentProps={{ style: { minWidth: '0' } }} />
      );
      const viewport = rendered.getByTestId(VIEWPORT_TEST_ID);
      const contentWrapper = viewport.firstElementChild as HTMLElement;
      expect(contentWrapper.style.minWidth).toBe('0');
      expect(contentWrapper.style.display).toBe('table');
    });

    it('should still render children correctly when contentProps is provided', () => {
      const rendered = render(
        <ScrollAreaTest
          contentProps={{ style: { display: 'flex', flexDirection: 'column' } }}
        />
      );
      expect(rendered.getByText(CONTENT_TEXT)).toBeInTheDocument();
    });
  });
});
