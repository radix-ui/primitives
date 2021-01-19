import React from 'react';
import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import { getSelector } from '@radix-ui/utils';
import { AspectRatio } from './AspectRatio';

const RATIO = 1 / 2;

describe('given a default Arrow', () => {
  let rendered: RenderResult;
  let container: HTMLElement;

  beforeEach(() => {
    rendered = render(
      <div style={{ width: 500 }}>
        <AspectRatio ratio={RATIO}>
          <span>Hello</span>
        </AspectRatio>
      </div>
    );
    container = rendered.getByText('Hello').parentElement!;
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have a radix attribute', () => {
    const partDataAttr = `data-${getSelector('AspectRatio')}`;
    expect(container).toHaveAttribute(partDataAttr);
  });
});
