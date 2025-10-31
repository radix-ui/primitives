import * as React from 'react';
import { composeRefs } from '@radix-ui/react-compose-refs';

declare module 'react' {
  interface ReactElement {
    $$typeof?: symbol | string;
  }
}

const REACT_LAZY_TYPE = Symbol.for('react.lazy');

interface LazyReactElement extends React.ReactElement {
  $$typeof: typeof REACT_LAZY_TYPE;
  _payload: PromiseLike<Exclude<React.ReactNode, PromiseLike<any>>>;
}

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

const use: typeof React.use | undefined = (React as any)[' use '.trim().toString()];

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value;
}

function isLazyComponent(element: React.ReactNode): element is LazyReactElement {
  return (
    element != null &&
    typeof element === 'object' &&
    '$$typeof' in element &&
    element.$$typeof === REACT_LAZY_TYPE &&
    '_payload' in element &&
    isPromiseLike(element._payload)
  );
}

/* @__NO_SIDE_EFFECTS__ */ export function createSlot(ownerName: string) {
  const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    let slottableElement: React.ReactElement | null = null;
    const newChildren: React.ReactNode[] = [];

    if (isLazyComponent(children)) {
      children = typeof use === 'function' ? use(children._payload) : null;
    }

    React.Children.forEach(children, (maybeSlottable) => {
      if (isSlottable(maybeSlottable)) {
        const slottable = maybeSlottable;
        let child = 'child' in slottable.props ? slottable.props.child : slottable.props.children;

        if (isLazyComponent(child)) {
          child = typeof use === 'function' ? use(child._payload) : null;
        }

        slottableElement = getSlottableElementFromSlottable(slottable, child);
        newChildren.push((slottableElement?.props as any)?.children);
      } else {
        newChildren.push(maybeSlottable);
      }
    });

    if (slottableElement) {
      slottableElement = React.cloneElement(slottableElement, undefined, newChildren);
    } else if (React.Children.count(children) === 1 && React.isValidElement(children)) {
      slottableElement = children;
    }

    if (!slottableElement) {
      // TODO: Conditionally warn only in development once our dev builds are set up.
      if (children || children === 0) {
        console.warn(createSlotWarning(ownerName));
      }

      return children;
    }

    const slottableElementRef = getElementRef(slottableElement);
    const composedRefs = composeRefs(forwardedRef, slottableElementRef);
    const mergedProps = mergeProps(slotProps, slottableElement.props ?? {});

    // do not pass ref to React.Fragment for React 19 compatibility
    if (slottableElement.type !== React.Fragment) {
      mergedProps.ref = forwardedRef ? composedRefs : slottableElementRef;
    }

    return React.cloneElement(slottableElement, mergedProps);
  });

  Slot.displayName = `${ownerName}.Slot`;
  return Slot;
}

const Slot = createSlot('Slot');

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const SLOTTABLE_IDENTIFIER = Symbol.for('radix.slottable');

interface SlottableChildrenProps {
  children: React.ReactNode;
}

interface SlottableRenderFnProps {
  child: React.ReactNode;
  children: (slottable: React.ReactNode) => React.ReactNode;
}

type SlottableProps = SlottableRenderFnProps | SlottableChildrenProps;
interface SlottableComponent extends React.FC<SlottableProps> {
  __radixId: symbol;
}

/* @__NO_SIDE_EFFECTS__ */ export function createSlottable(ownerName: string) {
  const Slottable: SlottableComponent = (props) => {
    if ('child' in props) {
      if (typeof props.children !== 'function') {
        throw new Error('Slottable children must be a function when `child` is provided');
      }
      return props.children(props.child);
    }

    return props.children;
  };

  Slottable.displayName = `${ownerName}.Slottable`;
  Slottable.__radixId = SLOTTABLE_IDENTIFIER;
  return Slottable;
}

const Slottable = createSlottable('Slottable');

/* ---------------------------------------------------------------------------------------------- */

type SlottableElement = React.ReactElement<SlottableProps, SlottableComponent>;

function getSlottableElementFromSlottable(slottable: SlottableElement, child: React.ReactNode) {
  if ('child' in slottable.props) {
    const child = slottable.props.child;
    if (!React.isValidElement<React.PropsWithChildren>(child)) return null;
    return React.cloneElement(child, undefined, slottable.props.children(child.props.children));
  }

  return React.isValidElement(child) ? child : null;
}

type AnyProps = Record<string, any>;

function isSlottable(child: React.ReactNode): child is SlottableElement {
  return (
    React.isValidElement(child) &&
    typeof child.type === 'function' &&
    '__radixId' in child.type &&
    child.type.__radixId === SLOTTABLE_IDENTIFIER
  );
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      }
      // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
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

// Before React 19 accessing `element.props.ref` will throw a warning and suggest using `element.ref`
// After React 19 accessing `element.ref` does the opposite.
// https://github.com/facebook/react/pull/28348
//
// Access the ref using the method that doesn't yield a warning.
function getElementRef(element: React.ReactElement) {
  // React <=18 in DEV
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get;
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element as any).ref;
  }

  // React 19 in DEV
  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get;
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref;
  }

  // Not DEV
  return (element.props as { ref?: React.Ref<unknown> }).ref || (element as any).ref;
}

function createSlotWarning(ownerName: string) {
  return `${ownerName} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`;
}

export {
  Slot,
  Slottable,
  //
  Slot as Root,
};
export type { SlotProps };
