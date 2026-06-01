import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import * as DropdownMenu from './dropdown-menu';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const TRIGGER_TEXT = 'Open';
const APPLY_TEXT = 'Apply';
const CREATE_TEXT = 'Create New';

const DropdownMenuWithFooterTest = (props: React.ComponentProps<typeof DropdownMenu.Root>) => (
  <DropdownMenu.Root {...props}>
    <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Cut</DropdownMenu.Item>
        <DropdownMenu.Item>Copy</DropdownMenu.Item>
        <DropdownMenu.Item>Paste</DropdownMenu.Item>
        <div>
          <button>{APPLY_TEXT}</button>
          <button>{CREATE_TEXT}</button>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

describe('given an open DropdownMenu with footer actions', () => {
  let rendered: RenderResult;
  const onOpenChange = vi.fn();

  afterEach(() => {
    cleanup();
    onOpenChange.mockClear();
  });

  beforeEach(async () => {
    rendered = render(
      <DropdownMenuWithFooterTest defaultOpen modal={false} onOpenChange={onOpenChange} />,
    );
    await waitFor(() => expect(rendered.getByText('Cut')).toBeVisible());
  });

  describe('when pressing Tab at the last tabbable element', () => {
    beforeEach(() => {
      const createButton = rendered.getByText(CREATE_TEXT);
      createButton.focus();
      fireEvent.keyDown(createButton, { key: 'Tab' });
    });

    it('should close the menu', async () => {
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('when pressing Shift+Tab at the first tabbable element', () => {
    beforeEach(() => {
      const firstItem = rendered.getByText('Cut');
      firstItem.focus();
      fireEvent.keyDown(firstItem, { key: 'Tab', shiftKey: true });
    });

    it('should close the menu', async () => {
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('when pressing Tab on a middle tabbable element', () => {
    beforeEach(() => {
      const applyButton = rendered.getByText(APPLY_TEXT);
      applyButton.focus();
      fireEvent.keyDown(applyButton, { key: 'Tab' });
    });

    it('should not close the menu', () => {
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });

    it('should keep the content visible', () => {
      expect(rendered.getByText('Cut')).toBeVisible();
    });
  });
});
