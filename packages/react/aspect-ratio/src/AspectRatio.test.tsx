import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

const RATIO = 1 / 2;

describe('given a default Arrow', () => {
  let rendered: RenderResult;

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
