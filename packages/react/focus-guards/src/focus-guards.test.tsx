import * as React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { useFocusGuards, FocusGuards } from './focus-guards';

function Guarded() {
  useFocusGuards();
  return null;
}

function getGuards() {
  return document.querySelectorAll('[data-radix-focus-guard]');
}

// Regression tests for https://github.com/radix-ui/primitives/issues/2812
describe('useFocusGuards', () => {
  afterEach(cleanup);

  it('injects a single pair of guards at the edges of <body>', () => {
    render(<Guarded />);
    const guards = getGuards();
    expect(guards).toHaveLength(2);
    expect(document.body.firstElementChild).toBe(guards[0]);
    expect(document.body.lastElementChild).toBe(guards[1]);
  });

  it('does not duplicate guards when multiple consumers mount', () => {
    render(
      <>
        <Guarded />
        <Guarded />
        <Guarded />
      </>,
    );
    expect(getGuards()).toHaveLength(2);
  });

  it('removes the guards only after the last consumer unmounts', () => {
    const { rerender } = render(
      <>
        <Guarded />
        <Guarded />
      </>,
    );
    expect(getGuards()).toHaveLength(2);

    rerender(
      <>
        <Guarded />
      </>,
    );
    expect(getGuards()).toHaveLength(2);

    rerender(<></>);
    expect(getGuards()).toHaveLength(0);
  });

  it('does not write to the DOM when an extra consumer mounts and the guards are already in place', () => {
    const { rerender } = render(
      <>
        <Guarded />
      </>,
    );

    const insertSpy = vi.spyOn(document.body, 'insertAdjacentElement');
    rerender(
      <>
        <Guarded />
        <Guarded />
      </>,
    );
    expect(insertSpy).not.toHaveBeenCalled();
    insertSpy.mockRestore();
  });

  it('re-asserts the trailing guard as the last child when a node is appended after it', () => {
    const { rerender } = render(
      <>
        <Guarded />
      </>,
    );
    const end = getGuards()[1];

    // Simulate a portal appending content to the end of <body>.
    const portal = document.createElement('div');
    document.body.appendChild(portal);
    expect(document.body.lastElementChild).toBe(portal);

    rerender(
      <>
        <Guarded />
        <Guarded />
      </>,
    );

    // The same trailing guard instance is moved back to the end (not duplicated).
    expect(getGuards()).toHaveLength(2);
    expect(document.body.lastElementChild).toBe(end);
    portal.remove();
  });
});

describe('FocusGuards', () => {
  afterEach(cleanup);

  it('renders text children', () => {
    render(<FocusGuards>Hello</FocusGuards>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders JSX children', () => {
    render(
      <FocusGuards>
        <div data-testid="hello">Hello</div>
      </FocusGuards>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('hello')).toBeInTheDocument();
  });

  it('injects a single pair of guards at the edges of <body>', () => {
    render(<FocusGuards />);
    const guards = getGuards();
    expect(guards).toHaveLength(2);
    expect(document.body.firstElementChild).toBe(guards[0]);
    expect(document.body.lastElementChild).toBe(guards[1]);
  });
});
