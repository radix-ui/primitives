import React from 'react';
import { axe } from 'jest-axe';
import type { RenderResult } from '@testing-library/react';
import { render, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Collapsible, CollapsibleButton, CollapsibleContent } from './Collapsible';

const BUTTON_TEXT = 'Button';
const CONTENT_TEXT = 'Content';

const CollapsibleTest = (props: React.ComponentProps<typeof Collapsible>) => (
  <Collapsible {...props}>
    <CollapsibleButton>{BUTTON_TEXT}</CollapsibleButton>
    <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
  </Collapsible>
);

describe('given a default Collapsible', () => {
  let rendered: RenderResult;
  let button: HTMLElement;
  let content: HTMLElement | null;

  beforeEach(() => {
    rendered = render(<CollapsibleTest />);
    button = rendered.getByText(BUTTON_TEXT);
    content = rendered.queryByText(CONTENT_TEXT);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when clicking the button', () => {
    beforeEach(async () => {
      fireEvent.click(button);
      await waitFor(() => {
        content = rendered.getByText(CONTENT_TEXT);
        expect(content).toBeVisible();
      });
    });

    it('should open the content', () => {
      expect(content).toBeVisible();
    });

    describe('and clicking the button again', () => {
      beforeEach(async () => {
        fireEvent.click(button);
        await waitForElementToBeRemoved(() => rendered.getByText(CONTENT_TEXT));
      });

      it('should close the content', async () => {
        expect(content).not.toBeVisible();
      });
    });
  });
});

describe('given an open uncontrolled Collapsible', () => {
  let rendered: RenderResult;
  const onOpenChange = jest.fn();

  beforeEach(() => {
    rendered = render(<CollapsibleTest defaultOpen onOpenChange={onOpenChange} />);
  });

  describe('when clicking the button', () => {
    beforeEach(async () => {
      const button = rendered.getByText(BUTTON_TEXT);
      fireEvent.click(button);
      await waitForElementToBeRemoved(() => rendered.getByText(CONTENT_TEXT));
    });

    it('should call `onOpenChange` prop with `false` value', () => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

describe('given an open controlled Collapsible', () => {
  let rendered: RenderResult;
  let content: HTMLElement;
  const onOpenChange = jest.fn();

  beforeEach(() => {
    rendered = render(<CollapsibleTest open onOpenChange={onOpenChange} />);
    content = rendered.getByText(CONTENT_TEXT);
  });

  describe('when clicking the button', () => {
    beforeEach(() => {
      const button = rendered.getByText(BUTTON_TEXT);
      fireEvent.click(button);
    });

    it('should call `onOpenChange` prop with `false` value', () => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not close the content', () => {
      expect(content).toBeVisible();
    });
  });
});
