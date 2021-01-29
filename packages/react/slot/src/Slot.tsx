import * as React from 'react';
import { composeRefs, composeEventHandlers } from '@radix-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

type SlotProps = { children: React.ReactNode };

const Slot = React.forwardRef<never, SlotProps>((props, forwardedRef) => {
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
  const { children, ...slotProps } = props;
  const child = React.Children.only(children);

  return React.isValidElement(child)
    ? React.cloneElement(child, {
        ...mergeProps(slotProps, child.props),
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

function mergeProps<P extends { [key: string]: any }>(baseProps: P, otherProps: P) {
  // all other props should override
  const overrideProps = { ...otherProps };

  // if it's a handler, modify the override by composing the base handler
  for (const propName in otherProps) {
    const basePropValue = baseProps[propName];
    const otherPropValue = otherProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);

    if (isHandler) {
      // make sure we only override handlers which are actually passed in as functions
      overrideProps[propName] =
        typeof basePropValue === 'function' && typeof otherPropValue === 'function'
          ? (composeEventHandlers(otherPropValue, basePropValue) as any)
          : basePropValue;
    }
  }

  return { ...baseProps, ...overrideProps };
}

const Root = Slot;

export {
  Slot,
  Slottable,
  //
  Root,
};
