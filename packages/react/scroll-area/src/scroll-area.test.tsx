import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as ScrollArea from './scroll-area';

describe('ScrollArea', () => {
  afterEach(cleanup);

  // Regression test for https://github.com/radix-ui/primitives/issues/3646
  it('should use block display on the viewport content wrapper', () => {
    const { container } = render(
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <div>content</div>
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const contentWrapper = container.querySelector('[data-radix-scroll-area-viewport] > div');
    expect(contentWrapper).toHaveStyle({ display: 'block' });
  });
});
