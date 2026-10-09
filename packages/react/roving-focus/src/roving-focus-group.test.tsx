import * as React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import * as RovingFocusGroup from './roving-focus-group';

describe('RovingFocusGroup', () => {
  afterEach(cleanup);

  describe('entry focus', () => {
    it('should focus the first item when tabbing into the group', async () => {
      const user = userEvent.setup();
      render(
        <>
          <input aria-label="before" />
          <RovingFocusGroup.Root data-testid="group">
            <RovingFocusGroup.Item asChild>
              <button>One</button>
            </RovingFocusGroup.Item>
            <RovingFocusGroup.Item asChild>
              <button>Two</button>
            </RovingFocusGroup.Item>
          </RovingFocusGroup.Root>
        </>,
      );

      act(() => screen.getByLabelText('before').focus());
      await user.tab();

      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    });

    it('should focus the first item when shift+tabbing into the group', async () => {
      const user = userEvent.setup();
      render(
        <>
          <RovingFocusGroup.Root data-testid="group">
            <RovingFocusGroup.Item asChild>
              <button>One</button>
            </RovingFocusGroup.Item>
            <RovingFocusGroup.Item asChild>
              <button>Two</button>
            </RovingFocusGroup.Item>
          </RovingFocusGroup.Root>
          <input aria-label="after" />
        </>,
      );

      act(() => screen.getByLabelText('after').focus());
      await user.tab({ shift: true });

      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    });

    it('should focus the active item when tabbing into the group', async () => {
      const user = userEvent.setup();
      render(
        <>
          <input aria-label="before" />
          <RovingFocusGroup.Root data-testid="group">
            <RovingFocusGroup.Item asChild>
              <button>One</button>
            </RovingFocusGroup.Item>
            <RovingFocusGroup.Item asChild active>
              <button>Two</button>
            </RovingFocusGroup.Item>
          </RovingFocusGroup.Root>
        </>,
      );

      act(() => screen.getByLabelText('before').focus());
      await user.tab();

      expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus();
    });

    it('should focus the first item when the group is focused programmatically', () => {
      render(
        <RovingFocusGroup.Root data-testid="group">
          <RovingFocusGroup.Item asChild>
            <button>One</button>
          </RovingFocusGroup.Item>
          <RovingFocusGroup.Item asChild>
            <button>Two</button>
          </RovingFocusGroup.Item>
        </RovingFocusGroup.Root>,
      );

      act(() => screen.getByTestId('group').focus());

      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    });

    it('should keep focus on the group when its background is clicked', async () => {
      const user = userEvent.setup();
      render(
        <RovingFocusGroup.Root data-testid="group">
          <RovingFocusGroup.Item asChild>
            <button>One</button>
          </RovingFocusGroup.Item>
          <RovingFocusGroup.Item asChild>
            <button>Two</button>
          </RovingFocusGroup.Item>
        </RovingFocusGroup.Root>,
      );
      const group = screen.getByTestId('group');

      await user.click(group);

      expect(group).toHaveFocus();
    });
  });

  describe('when the document regains focus after the group background was clicked', () => {
    it('should keep focus on the group', async () => {
      const user = userEvent.setup();
      render(
        <RovingFocusGroup.Root data-testid="group">
          <RovingFocusGroup.Item asChild>
            <button>One</button>
          </RovingFocusGroup.Item>
          <RovingFocusGroup.Item asChild>
            <button>Two</button>
          </RovingFocusGroup.Item>
        </RovingFocusGroup.Root>,
      );
      const group = screen.getByTestId('group');

      await user.click(group);
      fireEvent.blur(group);
      fireEvent.focus(group);

      expect(group).toHaveFocus();
    });

    it('should keep focus on the group across repeated document blur and focus after clicking twice', async () => {
      const user = userEvent.setup();
      render(
        <RovingFocusGroup.Root data-testid="group">
          <RovingFocusGroup.Item asChild>
            <button>One</button>
          </RovingFocusGroup.Item>
          <RovingFocusGroup.Item asChild>
            <button>Two</button>
          </RovingFocusGroup.Item>
        </RovingFocusGroup.Root>,
      );
      const group = screen.getByTestId('group');

      await user.click(group);
      await user.click(group);
      fireEvent.blur(group);
      fireEvent.focus(group);
      expect(group).toHaveFocus();

      fireEvent.blur(group);
      fireEvent.focus(group);
      expect(group).toHaveFocus();
    });

    it('should focus the first item when tabbing into the group afterwards', async () => {
      const user = userEvent.setup();
      render(
        <>
          <input aria-label="before" />
          <RovingFocusGroup.Root data-testid="group">
            <RovingFocusGroup.Item asChild>
              <button>One</button>
            </RovingFocusGroup.Item>
            <RovingFocusGroup.Item asChild>
              <button>Two</button>
            </RovingFocusGroup.Item>
          </RovingFocusGroup.Root>
        </>,
      );
      const group = screen.getByTestId('group');

      await user.click(group);
      fireEvent.blur(group);
      fireEvent.focus(group);
      act(() => screen.getByLabelText('before').focus());
      await user.tab();

      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    });

    it('should focus the first item when focus enters the group from another element', async () => {
      const user = userEvent.setup();
      render(
        <>
          <input aria-label="before" />
          <RovingFocusGroup.Root data-testid="group">
            <RovingFocusGroup.Item asChild>
              <button>One</button>
            </RovingFocusGroup.Item>
            <RovingFocusGroup.Item asChild>
              <button>Two</button>
            </RovingFocusGroup.Item>
          </RovingFocusGroup.Root>
        </>,
      );
      const group = screen.getByTestId('group');

      await user.click(group);
      fireEvent.blur(group);
      fireEvent.focus(group, { relatedTarget: screen.getByLabelText('before') });

      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    });

    it('should focus the first item when focus returns to the group after focus moved elsewhere while the document was blurred', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Dialog</button>
          <RovingFocusGroup.Root data-testid="group">
            <RovingFocusGroup.Item asChild>
              <button>One</button>
            </RovingFocusGroup.Item>
            <RovingFocusGroup.Item asChild>
              <button>Two</button>
            </RovingFocusGroup.Item>
          </RovingFocusGroup.Root>
        </>,
      );
      const group = screen.getByTestId('group');
      const stopEvent = (event: Event) => event.stopImmediatePropagation();

      await user.click(group);
      fireEvent.blur(group);
      window.addEventListener('focusout', stopEvent, true);
      window.addEventListener('focusin', stopEvent, true);
      act(() => screen.getByRole('button', { name: 'Dialog' }).focus());
      window.removeEventListener('focusout', stopEvent, true);
      window.removeEventListener('focusin', stopEvent, true);
      fireEvent.focus(window);
      fireEvent.focus(group);

      expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    });

    it('should keep focus on the group when it is rendered in a shadow root', async () => {
      const user = userEvent.setup();
      const host = document.createElement('div');
      document.body.appendChild(host);
      const shadowRoot = host.attachShadow({ mode: 'open' });
      const container = document.createElement('div');
      shadowRoot.appendChild(container);
      render(
        <RovingFocusGroup.Root data-testid="group">
          <RovingFocusGroup.Item asChild>
            <button>One</button>
          </RovingFocusGroup.Item>
          <RovingFocusGroup.Item asChild>
            <button>Two</button>
          </RovingFocusGroup.Item>
        </RovingFocusGroup.Root>,
        { container },
      );
      const group = shadowRoot.querySelector<HTMLElement>('[data-testid="group"]')!;

      await user.click(group);
      fireEvent.blur(group);
      fireEvent.focus(group);

      expect(shadowRoot.activeElement).toBe(group);
      host.remove();
    });
  });
});
