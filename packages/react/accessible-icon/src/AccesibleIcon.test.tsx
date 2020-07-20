import React from 'react';
import { axe } from 'jest-axe';
import { render, RenderResult } from '@testing-library/react';
import { interopDataAttr } from '@interop-ui/utils';
import { AccessibleIcon } from './AccessibleIcon';

const LABEL_TEXT = 'Close';

const AccessibleIconTest = (props: Omit<React.ComponentProps<typeof AccessibleIcon>, 'label'>) => (
  <AccessibleIcon {...props} label={LABEL_TEXT} />
);

describe('given a default AccessibleIcon', () => {
  let rendered: RenderResult;
  let label: HTMLElement;

  beforeEach(() => {
    rendered = render(
      <AccessibleIconTest>
        <svg
          viewBox="0 0 32 32"
          width={24}
          height={24}
          fill="none"
          stroke="currentColor"
          data-testid="icon"
        >
          <path d="M2 30 L30 2 M30 30 L2 2" />
        </svg>
      </AccessibleIconTest>
    );

    label = rendered.getByText(LABEL_TEXT);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have an interop attribute on the container', () => {
    const container = rendered.container.firstChild;
    const interopAttr = interopDataAttr('AccessibleIcon');
    expect(container).toHaveAttribute(interopAttr);
  });

  it('should have a label', () => {
    expect(label).toBeInTheDocument();
  });

  it('should add a hidden aria attribute to the child', () => {
    const svg = rendered.getByTestId('icon');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('given an AccessibleIcon without children', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(global, 'window', 'get');
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('should error', () => {
    // Mock error to prevent it from logging to console
    spy.mockImplementation(() => ({ TypeError: () => {} }));
    expect(() => render(<AccessibleIconTest />)).toThrowError();
  });
});

describe('given a styled AccessibleIcon', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(
      <AccessibleIconTest className="icon-class">
        <b>Foo</b>
      </AccessibleIconTest>
    );
  });

  it('should pass the className to the container', () => {
    const container = rendered.container.firstChild;
    expect(container).toHaveClass('icon-class');
  });
});
