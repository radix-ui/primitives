import * as React from 'react';
import { composeRefs } from '@radix-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

type SlotProps = { children: React.ReactNode };

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childLength = React.Children.count(children);

  if (childLength === 1) {
    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {children}
      </SlotClone>
    );
  }

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Slottable) {
          return (
            <SlotClone {...slotProps} ref={forwardedRef}>
              {child.props.children}
            </SlotClone>
          );
        }

        return child;
      })}
    </>
  );
});

Slot.displayName = 'Slot';

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/

type SlotCloneProps = { children: React.ReactNode };

const SlotClone = React.forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...cloneProps } = props;
  const child = React.Children.only(children);

  return React.isValidElement(child)
    ? React.cloneElement(child, {
        ...cloneProps,
        ...child.props,
        ref: composeRefs(forwardedRef, (child as any).ref),
      })
    : null;
});

SlotClone.displayName = 'SlotClone';

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const Slottable = ({ children }: { children: React.ReactNode }) => {
  return children as React.ReactElement;
};

/* ---------------------------------------------------------------------------------------------- */

export { Slot, Slottable };
