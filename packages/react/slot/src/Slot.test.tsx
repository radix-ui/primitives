import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slot, Slottable } from '@radix-ui/react-slot';

describe('given a slotted Trigger', () => {
  describe('with onClick on itself', () => {
    const handleClick = jest.fn();

    beforeEach(() => {
      handleClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleClick}>
          <button type="button">Click me</button>
        </Trigger>
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it('should call the onClick passed to the Trigger', async () => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with onClick on the child', () => {
    const handleClick = jest.fn();

    beforeEach(() => {
      handleClick.mockReset();
      render(
        <Trigger as={Slot}>
          <button type="button" onClick={handleClick}>
            Click me
          </button>
        </Trigger>
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the child's onClick", async () => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with onClick on itself AND the child', () => {
    const handleTriggerClick = jest.fn();
    const handleChildClick = jest.fn();

    beforeEach(() => {
      handleTriggerClick.mockReset();
      handleChildClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleTriggerClick}>
          <button type="button" onClick={handleChildClick}>
            Click me
          </button>
        </Trigger>
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
    const handleTriggerClick = jest.fn();

    beforeEach(() => {
      handleTriggerClick.mockReset();
      render(
        <Trigger as={Slot} onClick={handleTriggerClick}>
          <button type="button" onClick={undefined}>
            Click me
          </button>
        </Trigger>
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the Trigger's onClick", async () => {
      expect(handleTriggerClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with undefined onClick on itself AND onClick on the child', () => {
    const handleChildClick = jest.fn();

    beforeEach(() => {
      handleChildClick.mockReset();
      render(
        <Trigger as={Slot} onClick={undefined}>
          <button type="button" onClick={handleChildClick}>
            Click me
          </button>
        </Trigger>
      );
      fireEvent.click(screen.getByRole('button'));
    });

    it("should call the child's onClick", async () => {
      expect(handleChildClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('given a Button with Slottable', () => {
  describe('without asChild', () => {
    it('should render a button with icon on the left/right', async () => {
      const tree = render(
        <Button iconLeft={<span>left</span>} iconRight={<span>right</span>}>
          Button <em>text</em>
        </Button>
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
        </Button>
      );

      expect(tree.container).toMatchSnapshot();
    });
  });
});

type TriggerProps = React.ComponentProps<'button'> & { as: React.ElementType };

const Trigger = ({ as: Comp = 'button', ...props }: TriggerProps) => <Comp {...props} />;

const Button = React.forwardRef<
  React.ElementRef<'button'>,
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
