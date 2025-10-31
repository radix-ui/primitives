import * as React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slot, Slottable } from './slot';
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
        </ButtonNested>
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render a button with icon on the left/right and a span around its children', async () => {
      const tree = render(
        <ButtonNested iconLeft={<span>left</span>} iconRight={<span>right</span>}>
          Button <em>text</em>
        </ButtonNested>
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
        </ButtonNested>
      );

      expect(tree.container).toMatchSnapshot();
    });

    it('should render a link with icon on the left/right and a span around its children', async () => {
      const tree = render(
        <ButtonNested asChild iconLeft={<span>left</span>} iconRight={<span>right</span>}>
          <a href="https://radix-ui.com">
            Button <em>text</em>
          </a>
        </ButtonNested>
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
      onChange={(event) => setValue(event.target.value)}
      ref={forwardedRef}
      value={value}
    >
      {children}
    </Comp>
  );
});
