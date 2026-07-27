import * as React from 'react';
import type { MergePropsFunction } from './merge-props';
import type { Slottable } from './slot';

declare module 'react' {
  interface ReactElement {
    $$typeof?: symbol | string;
  }
}

type SlotProps<Elem extends Element = HTMLElement, Props = React.HTMLAttributes<Elem>> = Props & {
  children?: React.ReactNode;
  mergeProps?: MergePropsFunction;
};

const SLOTTABLE_IDENTIFIER = Symbol.for('radix.slottable');

type SlottableChildrenProps = { children: React.ReactNode };
type SlottableRenderFnProps = {
  child: React.ReactNode;
  children: (slottable: React.ReactNode) => React.ReactNode;
};

type SlottableProps = SlottableRenderFnProps | SlottableChildrenProps;
interface SlottableComponent extends React.FC<SlottableProps> {
  __radixId: symbol;
}

function getSlottableIdentifier() {
  return SLOTTABLE_IDENTIFIER;
}

function getSlottableElementFromSlottable(slottable: SlottableElement, child: React.ReactNode) {
  if ('child' in slottable.props) {
    const child = slottable.props.child;
    if (!React.isValidElement<React.PropsWithChildren>(child)) return null;
    return React.cloneElement(child, undefined, slottable.props.children(child.props.children));
  }

  return React.isValidElement(child) ? child : null;
}

/**
 * Before React 19 accessing `element.props.ref` will throw a warning and suggest using `element.ref`
 * After React 19 accessing `element.ref` does the opposite.
 * https://github.com/facebook/react/pull/28348
 *
 * Access the ref using the method that doesn't yield a warning.
 */
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

type SlottableElement = React.ReactElement<SlottableProps, SlottableComponent>;

function isSlottable(
  child: React.ReactNode,
): child is React.ReactElement<SlottableProps, typeof Slottable> {
  return (
    React.isValidElement(child) &&
    typeof child.type === 'function' &&
    '__radixId' in child.type &&
    child.type.__radixId === SLOTTABLE_IDENTIFIER
  );
}

const REACT_LAZY_TYPE = Symbol.for('react.lazy');

interface LazyReactElement extends React.ReactElement {
  $$typeof: typeof REACT_LAZY_TYPE;
  _payload: PromiseLike<Exclude<React.ReactNode, PromiseLike<any>>>;
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

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value;
}

function createSlotError(ownerName: string) {
  return `${ownerName} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`;
}

function createSlottableError(ownerName: string) {
  return `${ownerName} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`;
}

export {
  //
  createSlotError,
  createSlottableError,
  getElementRef,
  getSlottableElementFromSlottable,
  getSlottableIdentifier,
  isLazyComponent,
  isSlottable,
};
export type { SlotProps, SlottableComponent, SlottableElement, SlottableProps };
