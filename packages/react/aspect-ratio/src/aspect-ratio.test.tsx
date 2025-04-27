import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render } from '@testing-library/react';
import { AspectRatio } from './aspect-ratio';
import { afterEach, describe, it, beforeEach, expect } from 'vitest';

const RATIO = 1 / 2;

describe('given a default Arrow', () => {
  let rendered: RenderResult;

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <div style={{ width: 500 }}>
        <AspectRatio ratio={RATIO}>
          <span>Hello</span>
        </AspectRatio>
      </div>
    );
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });
});
