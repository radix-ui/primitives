import * as React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slot, Slottable, SlotProvider, mergeProps } from './slot';
import type { AnyProps, MergePropsFunction } from './merge-props';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

describe('given a slotted Trigger', () => {
  afterEach(cleanup);
  describe('with onClick on itself', () => {
    const handleClick = vi.fn();

    beforeEach(() => {
      handleClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleClick}>
          <button type="button">Click me</button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it('should call the onClick passed to the Trigger', async () => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with onClick on the child', () => {
    const handleClick = vi.fn();

    beforeEach(() => {
      handleClick.mockReset();
      render(
        <Trigger as={Slot}>
          <button type="button" onClick={handleClick}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the child's onClick", async () => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with onClick on itself AND the child', () => {
    const handleTriggerClick = vi.fn();
    const handleChildClick = vi.fn();

    beforeEach(() => {
      handleTriggerClick.mockReset();
      handleChildClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleTriggerClick}>
          <button type="button" onClick={handleChildClick}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the Trigger's onClick", async () => {
      expect(handleTriggerClick).toHaveBeenCalledTimes(1);
    });

    it("should call the child's onClick", async () => {
      expect(handleChildClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with onClick on itself AND undefined onClick on the child', () => {
    const handleTriggerClick = vi.fn();

    beforeEach(() => {
      handleTriggerClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleTriggerClick}>
          <button type="button" onClick={undefined}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the Trigger's onClick", async () => {
      expect(handleTriggerClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with undefined onClick on itself AND onClick on the child', () => {
    const handleChildClick = vi.fn();

    beforeEach(() => {
      handleChildClick.mockReset();
      render(
        <Trigger as={Slot} onClick={undefined}>
          <button type="button" onClick={handleChildClick}>
            Click me
          </button>
        </Trigger>,
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the child's onClick", async () => {
      expect(handleChildClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('given a Button with Slottable', () => {
  afterEach(cleanup);
  describe('without asChild', () => {
    it('should render a button with icon on the left/right', async () => {
      const tree = render(
        <Button iconLeft={<span>left</span>} iconRight={<span>right</span>}>
          Button <em>text</em>
        </Button>,
      );

      expect(tree.container).toMatchSnapshot();
    });
  });

  describe('with asChild', () => {
    it('should render a link with icon on the left/right', async () => {
      const tree = render(
        <Button iconLeft={<span>left</span>} iconRight={<span>right</span>} asChild>
          <a href="https://radix-ui.com">
            Button <em>text</em>
          </a>
        </Button>,
      );

      expect(tree.container).toMatchSnapshot();
    });
  });
});

describe('given a Button with Slottable nesting', () => {
  afterEach(cleanup);
  describe('without asChild', () => {
    it('should render a button with a span around its children', async () => {
      const tree = render(
        <ButtonNested>
          Button <em>text</em>
        </ButtonNested>,
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render a button with icon on the left/right and a span around its children', async () => {
      const tree = render(
        <ButtonNested iconLeft={<span>left</span>} iconRight={<span>right</span>}>
          Button <em>text</em>
        </ButtonNested>,
      );

      expect(tree.container).toMatchSnapshot();
    });
  });

  describe('with asChild', () => {
    it('should render a link with a span around its children', async () => {
      const tree = render(
        <ButtonNested asChild>
          <a href="https://radix-ui.com">
            Button <em>text</em>
          </a>
        </ButtonNested>,
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render a link with icon on the left/right and a span around its children', async () => {
      const tree = render(
        <ButtonNested asChild iconLeft={<span>left</span>} iconRight={<span>right</span>}>
          <a href="https://radix-ui.com">
            Button <em>text</em>
          </a>
        </ButtonNested>,
      );

      expect(tree.container).toMatchSnapshot();
    });
  });
});

// TODO: Unskip when underlying issue is resolved
// Reverted in https://github.com/radix-ui/primitives/pull/3554
describe.skip('given an Input', () => {
  const handleRef = vi.fn();

  beforeEach(() => {
    handleRef.mockReset();
  });

  afterEach(cleanup);

  describe('without asChild', () => {
    it('should only call function refs once', async () => {
      render(<Input ref={handleRef} />);
      await userEvent.type(screen.getByRole('textbox'), 'foo');
      expect(handleRef).toHaveBeenCalledTimes(1);
    });
  });

  describe('with asChild', () => {
    it('should only call function refs once', async () => {
      render(
        <Input asChild ref={handleRef}>
          <input />
        </Input>,
      );
      await userEvent.type(screen.getByRole('textbox'), 'foo');
      expect(handleRef).toHaveBeenCalledTimes(1);
    });
  });
});

describe('given a Slot with React lazy components', () => {
  afterEach(cleanup);

  describe('with a lazy component as child', () => {
    const LazyButton = React.lazy(() =>
      Promise.resolve({
        default: ({ children, ...props }: React.ComponentProps<'button'>) => (
          <button {...props}>{children}</button>
        ),
      }),
    );

    it('should render the lazy component correctly', async () => {
      const handleClick = vi.fn();

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <Slot onClick={handleClick}>
            <LazyButton>Click me</LazyButton>
          </Slot>
        </React.Suspense>,
      );

      // Wait for lazy component to load
      await screen.findByRole('button');

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with a lazy component in Button with Slottable', () => {
    const LazyLink = React.lazy(() =>
      Promise.resolve({
        default: ({ children, ...props }: React.ComponentProps<'a'>) => (
          <a {...props}>{children}</a>
        ),
      }),
    );

    it('should render a lazy link with icon on the left/right', async () => {
      const tree = render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <Button iconLeft={<span>left</span>} iconRight={<span>right</span>} asChild>
            <LazyLink href="https://radix-ui.com">
              Button <em>text</em>
            </LazyLink>
          </Button>
        </React.Suspense>,
      );

      // Wait for lazy component to load
      await screen.findByRole('link');

      expect(tree.container).toMatchSnapshot();
    });
  });
});

/* -------------------------------------------------------------------------------------------------
 * Backwards compatibility & edge cases
 *
 * These guard the refactor in https://github.com/radix-ui/primitives/pull/3729 which removed the
 * internal `SlotClone` component, swapped the `React.Children.only()` throw for a dev warning, and
 * added the nested (render-prop) `Slottable` API. They lock in the public contract so we don't
 * silently regress prop/ref merging or start emitting warnings on legitimate conditional children.
 * -----------------------------------------------------------------------------------------------*/

describe('Slot prop and ref merging (single element child)', () => {
  afterEach(cleanup);

  it('merges className, forwards unknown props, and composes onClick (child first, then slot)', () => {
    const order: string[] = [];
    render(
      <Slot
        className="slot"
        data-from-slot="yes"
        data-only-slot="1"
        onClick={() => order.push('slot')}
      >
        <button
          className="child"
          data-from-child="yes"
          onClick={() => order.push('child')}
          type="button"
        >
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('class')).toBe('slot child');
    expect(button.getAttribute('data-from-slot')).toBe('yes');
    expect(button.getAttribute('data-from-child')).toBe('yes');
    expect(button.getAttribute('data-only-slot')).toBe('1');

    fireEvent.click(button);
    expect(order).toEqual(['child', 'slot']);
  });

  it('merges, normalizes, and deduplicates aria-describedby with the child ids first', () => {
    render(
      <Slot aria-describedby={' shared-description  slot-description '}>
        <button
          aria-describedby={' child-description\tshared-description child-description '}
          type="button"
        >
          hi
        </button>
      </Slot>,
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-describedby',
      'child-description shared-description slot-description',
    );
  });

  it('composes the Slot ref and the child ref onto the same node', () => {
    const slotRef = vi.fn();
    const childRef = vi.fn();
    render(
      <Slot ref={slotRef}>
        <button ref={childRef} type="button">
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    expect(slotRef).toHaveBeenCalledWith(button);
    expect(childRef).toHaveBeenCalledWith(button);
  });
});

describe('Slot with non-mergeable children', () => {
  // Errors thrown during render are also logged by React; silence them to keep test output clean.
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
    cleanup();
  });

  // Regression guard: conditional / empty children are extremely common and must NOT throw.
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['false (e.g. a falsy `&&` expression)', false],
  ])('renders nothing and does not throw for %s children', (_label, children) => {
    const { container } = render(<Slot className="x">{children}</Slot>);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders an empty Slot without throwing', () => {
    const { container } = render(<Slot className="x" />);
    expect(container).toBeEmptyDOMElement();
  });

  // Previously this threw via the cryptic `React.Children.only`; it now throws a descriptive error.
  it('throws a descriptive error when given multiple element children', () => {
    expect(() =>
      render(
        <Slot className="x" data-from-slot="yes">
          <button type="button">one</button>
          <button type="button">two</button>
        </Slot>,
      ),
    ).toThrow(/failed to slot onto its children/i);
  });

  it('throws a descriptive error for a single non-element child', () => {
    expect(() => render(<Slot className="x">hello</Slot>)).toThrow(
      /failed to slot onto its children/i,
    );
  });

  // Regression guard: a `Slottable` whose content can't be resolved to a single element used to
  // silently fall back to cloning the `Slottable` wrapper itself (dropping Slot props and
  // attaching the ref to a function component). It must now throw a `Slottable`-specific error.
  it('throws a Slottable error when a Slottable wraps multiple elements', () => {
    expect(() =>
      render(
        <Slot className="x">
          <Slottable>
            <a href="/">a</a>
            <b>b</b>
          </Slottable>
        </Slot>,
      ),
    ).toThrow(/Slottable.*single React element/i);
  });

  it('throws a Slottable error when a render-prop Slottable `child` is not an element', () => {
    expect(() =>
      render(
        <Slot className="x">
          <Slottable child={'plain text' as never}>
            {(slottable) => <span>{slottable}</span>}
          </Slottable>
        </Slot>,
      ),
    ).toThrow(/Slottable.*single React element/i);
  });

  it('throws a Slottable error when a Slottable wraps a non-element child', () => {
    expect(() =>
      render(
        <Slot className="x">
          <Slottable>just text</Slottable>
        </Slot>,
      ),
    ).toThrow(/Slottable.*single React element/i);
  });
});

describe('Slottable identifier interoperability (Symbol.for)', () => {
  afterEach(cleanup);

  // The identifier is `Symbol.for('radix.slottable')` (global registry) rather than a unique
  // `Symbol()`, so a `Slottable` produced by a *different copy/version* of the package is still
  // recognized. This guards against accidentally reverting to a realm-local symbol.
  it('recognizes a foreign Slottable marked with the shared symbol', () => {
    const ForeignSlottable: any = (props: any) =>
      'child' in props ? props.children(props.child) : props.children;
    ForeignSlottable.__radixId = Symbol.for('radix.slottable');

    const { container } = render(
      <Slot className="slot-class">
        <span data-icon>icon</span>
        <ForeignSlottable>
          <a href="/">link</a>
        </ForeignSlottable>
      </Slot>,
    );

    const link = container.querySelector('a')!;
    expect(link).not.toBeNull();
    // Slot props are merged onto the slottable's element, not the wrapper.
    expect(link.getAttribute('class')).toBe('slot-class');
    // The icon sibling is preserved inside the slotted element.
    expect(link.querySelector('[data-icon]')).not.toBeNull();
    expect(link).toHaveTextContent('iconlink');
  });
});

describe('Slottable (siblings) merges Slot props onto the slotted element', () => {
  afterEach(cleanup);

  it('merges className/handlers onto the slotted element while keeping siblings', () => {
    const handleClick = vi.fn();
    render(
      <Slot className="slot" onClick={handleClick}>
        <span data-icon-left>left</span>
        <Slottable>
          <a className="child" href="/">
            link
          </a>
        </Slottable>
        <span data-icon-right>right</span>
      </Slot>,
    );

    const link = screen.getByRole('link');
    expect(link.getAttribute('class')).toBe('slot child');
    expect(link.querySelector('[data-icon-left]')).not.toBeNull();
    expect(link.querySelector('[data-icon-right]')).not.toBeNull();
    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('nested (render-prop) Slottable', () => {
  afterEach(cleanup);

  it('merges Slot props onto the rendered child and wraps the original children', () => {
    const handleClick = vi.fn();
    render(
      <Slot className="slot" onClick={handleClick}>
        <Slottable child={<a href="/">link</a>}>
          {(slottable) => <span data-wrapper>{slottable}</span>}
        </Slottable>
      </Slot>,
    );

    const link = screen.getByRole('link');
    // Slot props land on the resolved child element (the <a>), not the wrapper span.
    expect(link.getAttribute('class')).toBe('slot');
    // The render prop wraps the *original* children of the child element.
    const wrapper = link.querySelector('[data-wrapper]')!;
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveTextContent('link');
    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('works under Suspense when the child element is lazy', async () => {
    const LazyLink = React.lazy(() =>
      Promise.resolve({
        default: ({ children, ...props }: React.ComponentProps<'a'>) => (
          <a {...props}>{children}</a>
        ),
      }),
    );

    render(
      <React.Suspense fallback={<div>loading</div>}>
        <Slot className="slot">
          <Slottable child={<LazyLink href="/">link</LazyLink>}>
            {(slottable) => <span data-wrapper>{slottable}</span>}
          </Slottable>
        </Slot>
      </React.Suspense>,
    );

    const link = await screen.findByRole('link');
    expect(link.getAttribute('class')).toBe('slot');
    expect(link.querySelector('[data-wrapper]')).not.toBeNull();
  });
});

describe('Slot with a custom mergeProps', () => {
  afterEach(cleanup);

  // Observably different from the default: classNames are joined with `__` + a
  // marker attribute is added so we can detect that it ran.
  const joinWithUnderscore: MergePropsFunction = (slotProps: AnyProps, childProps: AnyProps) => ({
    ...mergeProps(slotProps, childProps),
    className: [slotProps.className, childProps.className].filter(Boolean).join('__'),
    'data-merge-strategy': 'underscore',
  });

  it('uses a `mergeProps` function passed directly to the Slot', () => {
    render(
      <Slot className="slot" mergeProps={joinWithUnderscore}>
        <button className="child" type="button">
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('class')).toBe('slot__child');
    expect(button.getAttribute('data-merge-strategy')).toBe('underscore');
  });

  it('receives (slotProps, childProps) in that order', () => {
    const spy = vi.fn((slotProps: Record<string, any>, childProps: Record<string, any>) =>
      mergeProps(slotProps, childProps),
    );
    render(
      <Slot data-from-slot="yes" mergeProps={spy}>
        <button data-from-child="yes" type="button">
          hi
        </button>
      </Slot>,
    );

    expect(spy).toHaveBeenCalledTimes(1);
    const [slotProps, childProps] = spy.mock.calls[0]!;
    expect(slotProps).toMatchObject({ 'data-from-slot': 'yes' });
    expect(childProps).toMatchObject({ 'data-from-child': 'yes' });
  });

  it('applies a `mergeProps` provided via SlotProvider to nested Slots', () => {
    render(
      <SlotProvider mergeProps={joinWithUnderscore}>
        <Slot className="slot">
          <button className="child" type="button">
            hi
          </button>
        </Slot>
      </SlotProvider>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('class')).toBe('slot__child');
    expect(button.getAttribute('data-merge-strategy')).toBe('underscore');
  });

  it('prefers the Slot `mergeProps` prop over the one from SlotProvider', () => {
    const joinWithHash: MergePropsFunction = (slotProps: AnyProps, childProps: AnyProps) => ({
      ...mergeProps(slotProps, childProps),
      className: [slotProps.className, childProps.className].filter(Boolean).join('##'),
      'data-merge-strategy': 'hash',
    });

    render(
      <SlotProvider mergeProps={joinWithUnderscore}>
        <Slot className="slot" mergeProps={joinWithHash}>
          <button className="child" type="button">
            hi
          </button>
        </Slot>
      </SlotProvider>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('class')).toBe('slot##child');
    expect(button.getAttribute('data-merge-strategy')).toBe('hash');
  });

  it('falls back to the default merge (and logs) when a custom `mergeProps` throws', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const order: string[] = [];
    const boom: MergePropsFunction = () => {
      throw new Error('boom');
    };

    render(
      <Slot className="slot" mergeProps={boom} onClick={() => order.push('slot')}>
        <button className="child" onClick={() => order.push('child')} type="button">
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('class')).toBe('slot child');
    fireEvent.click(button);
    expect(order).toEqual(['child', 'slot']);

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('mergeProps failed'),
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });

  it('still composes the Slot ref and the child ref with a custom mergeProps', () => {
    const slotRef = vi.fn();
    const childRef = vi.fn();
    render(
      <Slot mergeProps={joinWithUnderscore} ref={slotRef}>
        <button ref={childRef} type="button">
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    expect(slotRef).toHaveBeenCalledWith(button);
    expect(childRef).toHaveBeenCalledWith(button);
  });
});

describe('Slot ref composition', () => {
  afterEach(cleanup);

  it('composes the forwarded ref and the child ref by default (no custom merge)', () => {
    const slotRef = vi.fn();
    const childRef = vi.fn();
    render(
      <Slot ref={slotRef}>
        <button ref={childRef} type="button">
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    expect(slotRef).toHaveBeenCalledWith(button);
    expect(childRef).toHaveBeenCalledWith(button);
  });

  it('exposes the composed ref on `slotProps` so a custom merge can pass it through', () => {
    const slotRef = vi.fn();
    const childRef = vi.fn();
    // A custom strategy that never touches `ref` explicitly: it just spreads
    // `slotProps`, which now carries the composed ref.
    const passthrough: MergePropsFunction = (slotProps: AnyProps, childProps: AnyProps) => ({
      ...childProps,
      ...slotProps,
      'data-custom': 'true',
    });

    render(
      <Slot mergeProps={passthrough} ref={slotRef}>
        <button ref={childRef} type="button">
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('data-custom')).toBe('true');
    expect(slotRef).toHaveBeenCalledWith(button);
    expect(childRef).toHaveBeenCalledWith(button);
  });

  it('drops the forwarded ref when a custom merge omits `ref` (child keeps its own)', () => {
    const slotRef = vi.fn();
    const childRef = vi.fn();
    const dropRef: MergePropsFunction = (slotProps: AnyProps, childProps: AnyProps) => {
      const { ref: _ref, ...rest } = mergeProps(slotProps, childProps);
      return rest;
    };

    render(
      <Slot mergeProps={dropRef} ref={slotRef}>
        <button ref={childRef} type="button">
          hi
        </button>
      </Slot>,
    );

    const button = screen.getByRole('button');
    // The Slot's forwarded ref was dropped by the custom merge...
    expect(slotRef).not.toHaveBeenCalled();
    // ...but the child keeps its own ref, since `React.cloneElement` preserves
    // props (including `ref`) that the merged props don't override.
    expect(childRef).toHaveBeenCalledWith(button);
  });

  it('does not attach a ref (or any props) to a Fragment child', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const slotRef = vi.fn();

    render(
      <Slot ref={slotRef}>
        <>
          <span>a</span>
          <span>b</span>
        </>
      </Slot>,
    );

    // React logs an error if a `ref` (or any non-`key`/`children` prop) is
    // passed to a Fragment. A clean render proves nothing leaked onto it.
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(slotRef).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('keeps a stable composed ref across re-renders (no detach/reattach)', () => {
    const childRef = vi.fn();

    function Wrapper() {
      const [, forceRender] = React.useState(0);
      const slotRef = React.useRef<HTMLButtonElement>(null);
      return (
        <div>
          <button data-testid="rerender" type="button" onClick={() => forceRender((n) => n + 1)}>
            rerender
          </button>
          <Slot ref={slotRef}>
            <span ref={childRef}>hi</span>
          </Slot>
        </div>
      );
    }

    render(<Wrapper />);
    expect(childRef).toHaveBeenCalledTimes(1);

    // If the composed ref identity changed on re-render, React would call the
    // child ref again (with `null`, then the node).
    fireEvent.click(screen.getByTestId('rerender'));
    expect(childRef).toHaveBeenCalledTimes(1);
  });
});

type TriggerProps = React.ComponentProps<'button'> & { as: React.ElementType };

const Trigger = ({ as: Comp = 'button', ...props }: TriggerProps) => <Comp {...props} />;

const Button = React.forwardRef<
  React.ComponentRef<'button'>,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  }
>(({ children, asChild = false, iconLeft, iconRight, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp {...props} ref={forwardedRef}>
      {iconLeft}
      <Slottable>{children}</Slottable>
      {iconRight}
    </Comp>
  );
});

const ButtonNested = React.forwardRef<
  React.ComponentRef<'button'>,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  }
>(({ children, asChild = false, iconLeft, iconRight, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp {...props} ref={forwardedRef}>
      {iconLeft}
      <Slottable child={children}>{(slottable) => <span>{slottable}</span>}</Slottable>
      {iconRight}
    </Comp>
  );
});

const Input = React.forwardRef<
  React.ComponentRef<'input'>,
  React.ComponentProps<'input'> & {
    asChild?: boolean;
  }
>(({ asChild, children, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot : 'input';
  const [value, setValue] = React.useState('');

  return (
    <Comp
      {...props}
      onChange={(event) => setValue((event.target as HTMLInputElement).value)}
      ref={forwardedRef}
      value={value}
    >
      {children}
    </Comp>
  );
});
