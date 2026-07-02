import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as Tabs from './tabs';

// Regression tests for https://github.com/radix-ui/primitives/issues/3232
describe('keys from focusable descendants', () => {
  afterEach(cleanup);

  const TabsWithPortaledInput = (props: React.ComponentProps<typeof Tabs.Root>) => (
    <Tabs.Root defaultValue="one" activationMode="manual" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">
          Two
          {ReactDOM.createPortal(<input data-testid="input" defaultValue="" />, document.body)}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">One content</Tabs.Content>
      <Tabs.Content value="two">Two content</Tabs.Content>
    </Tabs.Root>
  );

  it('does not activate a tab from Space/Enter typed into a portaled focusable descendant', () => {
    const onValueChange = vi.fn();
    render(<TabsWithPortaledInput onValueChange={onValueChange} />);
    const input = screen.getByTestId('input');
    input.focus();
    fireEvent.keyDown(input, { key: ' ' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('still activates the tab via Space/Enter when the trigger itself is focused', () => {
    const onValueChange = vi.fn();
    render(<TabsWithPortaledInput onValueChange={onValueChange} />);
    const trigger = screen.getByText('Two');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('two');
  });
});
