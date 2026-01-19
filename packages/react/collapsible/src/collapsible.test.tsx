import React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const TRIGGER_TEXT = 'Trigger';
const CONTENT_TEXT = 'Content';

const CollapsibleTest = (props: React.ComponentProps<typeof Collapsible>) => (
  <Collapsible {...props}>
    <CollapsibleTrigger>{TRIGGER_TEXT}</CollapsibleTrigger>
    <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
  </Collapsible>
);

describe('given a default Collapsible', () => {
  let rendered: RenderResult;
  let trigger: HTMLElement;
  let content: HTMLElement | null;

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(<CollapsibleTest />);
    trigger = rendered.getByText(TRIGGER_TEXT);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when clicking the trigger', () => {
    beforeEach(async () => {
      fireEvent.click(trigger);
      content = rendered.queryByText(CONTENT_TEXT);
    });

    it('should open the content', () => {
      expect(content).toBeVisible();
    });

    describe('and clicking the trigger again', () => {
      beforeEach(() => {
        fireEvent.click(trigger);
      });

      it('should close the content', () => {
        expect(content).not.toBeVisible();
      });
    });
  });
});

describe('given an open uncontrolled Collapsible', () => {
  let rendered: RenderResult;
  let content: HTMLElement | null;
  const onOpenChange = vi.fn();

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(<CollapsibleTest defaultOpen onOpenChange={onOpenChange} />);
  });

  describe('when clicking the trigger', () => {
    beforeEach(async () => {
      const trigger = rendered.getByText(TRIGGER_TEXT);
      content = rendered.getByText(CONTENT_TEXT);
      fireEvent.click(trigger);
    });

    it('should close the content', () => {
      expect(content).not.toBeVisible();
    });

    it('should call `onOpenChange` prop with `false` value', () => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

describe('given an open controlled Collapsible', () => {
  let rendered: RenderResult;
  let content: HTMLElement;
  const onOpenChange = vi.fn();

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(<CollapsibleTest open onOpenChange={onOpenChange} />);
    content = rendered.getByText(CONTENT_TEXT);
  });

  describe('when clicking the trigger', () => {
    beforeEach(() => {
      const trigger = rendered.getByText(TRIGGER_TEXT);
      fireEvent.click(trigger);
    });

    it('should call `onOpenChange` prop with `false` value', () => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not close the content', () => {
      expect(content).toBeVisible();
    });
  });
});
