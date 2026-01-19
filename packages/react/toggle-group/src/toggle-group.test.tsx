import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import * as ToggleGroup from './toggle-group';
import type { Mock } from 'vitest';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

describe('given a single ToggleGroup', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;
  let one: HTMLElement;
  let two: HTMLElement;

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(<ToggleGroupTest type="single" onValueChange={handleValueChange} />);
    one = rendered.getByText('One');
    two = rendered.getByText('Two');
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when clicking `One`', () => {
    beforeEach(() => {
      fireEvent.click(one);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should change value to `One`', () => {
      expect(handleValueChange).toHaveBeenCalledWith('One');
    });

    describe('then clicking `Two`', () => {
      beforeEach(() => {
        fireEvent.click(two);
      });

      it('should change value to `Two`', () => {
        expect(handleValueChange).toHaveBeenCalledWith('Two');
      });

      describe('and clicking `Two` again`', () => {
        beforeEach(() => {
          fireEvent.click(two);
        });

        it('should change value to empty string', () => {
          expect(handleValueChange).toHaveBeenCalledWith('');
        });
      });
    });
  });
});

describe('given a multiple ToggleGroup', () => {
  let handleValueChange: Mock;
  let rendered: RenderResult;
  let one: HTMLElement;
  let two: HTMLElement;

  beforeEach(() => {
    handleValueChange = vi.fn();
    rendered = render(<ToggleGroupTest type="multiple" onValueChange={handleValueChange} />);
    one = rendered.getByText('One');
    two = rendered.getByText('Two');
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when clicking `One`', () => {
    beforeEach(() => {
      fireEvent.click(one);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should change value to `One`', () => {
      expect(handleValueChange).toHaveBeenCalledWith(['One']);
    });

    describe('and clicking `One` again`', () => {
      beforeEach(() => {
        fireEvent.click(one);
      });

      it('should change value to empty array', () => {
        expect(handleValueChange).toHaveBeenCalledWith([]);
      });
    });

    describe('then clicking `Two`', () => {
      beforeEach(() => {
        fireEvent.click(two);
      });

      it('should add `Two` to value', () => {
        expect(handleValueChange).toHaveBeenCalledWith(['One', 'Two']);
      });

      describe('and clicking `Two` again`', () => {
        beforeEach(() => {
          fireEvent.click(two);
        });

        it('should change value to `One`', () => {
          expect(handleValueChange).toHaveBeenCalledWith(['One']);
        });
      });
    });
  });
});

const ToggleGroupTest = (props: React.ComponentProps<typeof ToggleGroup.Root>) => (
  <ToggleGroup.Root {...props}>
    <ToggleGroup.Item value="One">One</ToggleGroup.Item>
    <ToggleGroup.Item value="Two">Two</ToggleGroup.Item>
    <ToggleGroup.Item value="Three">Three</ToggleGroup.Item>
  </ToggleGroup.Root>
);
