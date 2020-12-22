import React from 'react';
import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import { getPartDataAttr } from '@radix-ui/utils';
import { Arrow } from './Arrow';

const WIDTH = 40;
const HEIGHT = 30;

describe('given a default Arrow', () => {
  let rendered: RenderResult;
  let svg: HTMLElement;

  beforeEach(() => {
    rendered = render(<Arrow width={WIDTH} height={HEIGHT} data-testid="test-arrow" />);
    svg = rendered.getByTestId('test-arrow');
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have a radix attribute', () => {
    const partDataAttr = getPartDataAttr('Arrow');
    expect(svg).toHaveAttribute(partDataAttr);
  });

  it('should have width attribute', () => {
    expect(svg).toHaveAttribute('width', String(WIDTH));
  });

  it('should have height attribute', () => {
    expect(svg).toHaveAttribute('height', String(HEIGHT));
  });
});
