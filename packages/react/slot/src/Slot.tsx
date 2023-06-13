'use client';

import * as React from 'react';
import { composeRefs } from '@radix-ui/react-compose-refs';

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    // the new element to render is the one passed as a child of `Slottable`
    const newElement = slottable.props.children as React.ReactNode;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // because the new element will be the one rendered, we are only interested
        // in grabbing its children (`newElement.props.children`)
        if (React.Children.count(newElement) > 1) return React.Children.only(null);
        return React.isValidElement(newElement)
          ? (newElement.props.children as React.ReactNode)
          : null;
      } else {
        return child;
      }
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
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
  // we check if children exist to avoid throwing when `{isBool && <Comp />}` is used
  const child = children ? React.Children.only(children) : null;
  const { handlerProps, otherProps } = mergeProps(slotProps, (child as any)?.props);
  const callbacks = useCallbackRefs({
    ...handlerProps,
    ref: composeRefs(forwardedRef, (child as any)?.ref),
  });
  return React.isValidElement(child)
    ? React.cloneElement(child, { ...otherProps, ...callbacks })
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

type AnyEvent = (...args: unknown[]) => void;
type AnyProps = Record<string, any>;
type HandlerProps = Record<string, AnyEvent | undefined>;

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && child.type === Slottable;
}

const useCallbackRefs = (callbacks: Record<string, AnyEvent>) => {
  const callbacksRef = React.useRef(callbacks);

  React.useLayoutEffect(() => {
    callbacksRef.current = callbacks;
  });

  return React.useMemo(() => {
    const entries = Object.keys(callbacksRef.current).map((name) => {
      // we wrap the callback in a function to ensure that it uses the latest ref when called
      const callback = (...args: unknown[]) => callbacksRef.current[name](...args);
      return [name, callback];
    });
    return Object.fromEntries(entries);
  }, []);
};

const HANDLER_REGEX = /^on[A-Z]/;

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // child props should override
  const merged = { ...slotProps, ...childProps };
  const handlerProps: HandlerProps = {};
  const otherProps: AnyProps = {};

  Object.entries(childProps).forEach(([childPropName, childPropValue]) => {
    const slotPropValue = slotProps[childPropName];

    if (HANDLER_REGEX.test(childPropName) && slotPropValue) {
      handlerProps[childPropName] = composeEvents(slotPropValue, childPropValue);
    } else {
      otherProps[childPropName] = merged[childPropName];
    }
  });

  if (slotProps.style && childProps.style) {
    otherProps.style = { ...slotProps.style, ...childProps.style };
  }

  if (slotProps.className && childProps.className) {
    otherProps.className = `${slotProps.className} ${childProps.className}`;
  }

  return { handlerProps, otherProps };
}

function composeEvents(slotEvent: AnyEvent, childEvent: (...args: unknown[]) => void) {
  return (...args: unknown[]) => {
    childEvent(...args);
    slotEvent(...args);
  };
}

const Root = Slot;

export {
  Slot,
  Slottable,
  //
  Root,
};
export type { SlotProps };
