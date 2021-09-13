import * as React from 'react';
import { composeRefs } from '@radix-ui/react-compose-refs';

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childLength = React.Children.count(children);

  return childLength === 1 ? (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  ) : React.Children.toArray(children).some(isSlottable) ? (
    <>
      {React.Children.map(children, (child) => {
        return isSlottable(child) ? (
          <SlotClone {...slotProps} ref={forwardedRef}>
            {child.props.children}
          </SlotClone>
        ) : (
          child
        );
      })}
    </>
  ) : (
    <>{React.Children.only(children)}</>
  );
});

Slot.displayName = 'Slot';

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/

interface SlotCloneProps {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  return React.isValidElement(children)
    ? React.cloneElement(children, {
        ...mergeProps(slotProps, children.props),
        ref: composeRefs(forwardedRef, (children as any).ref),
      })
    : null;
});

SlotClone.displayName = 'SlotClone';

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

/* ---------------------------------------------------------------------------------------------- */

type AnyProps = Record<string, any>;

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && child.type === Slottable;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    // if it's a handler, modify the override by composing the base handler
    if (isHandler) {
      overrideProps[propName] = composeHandlers(childPropValue, slotPropValue);
    }
    // if it's `style`, we merge them
    else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
}

type EventHandler = (...args: unknown[]) => unknown;

function composeHandlers(childHandler?: EventHandler, slotHandler?: EventHandler) {
  return function handleEvent(...args) {
    childHandler?.(...args);
    const isDefaultPreventedEvent = args[0] instanceof Event && args[0].defaultPrevented;
    if (!isDefaultPreventedEvent) {
      slotHandler?.(...args);
    }
  } as EventHandler;
}

const Root = Slot;

export {
  Slot,
  Slottable,
  //
  Root,
};
export type { SlotProps };
