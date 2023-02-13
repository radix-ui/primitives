import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Slot } from '@radix-ui/react-slot';

const NODES = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'span',
  'svg',
  'ul',
] as const;

// Temporary while we await merge of this fix:
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55396
// prettier-ignore
type PropsWithoutRef<P> = P extends any ? ('ref' extends keyof P ? Pick<P, Exclude<keyof P, 'ref'>> : P) : P;
type ComponentPropsWithoutRef<T extends React.ElementType> = PropsWithoutRef<
  React.ComponentProps<T>
>;

type Primitives = { [E in typeof NODES[number]]: PrimitiveForwardRefComponent<E> };
type PrimitivePropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> & {
  asChild?: boolean;
};

interface PrimitiveForwardRefComponent<E extends React.ElementType>
  extends React.ForwardRefExoticComponent<PrimitivePropsWithRef<E>> {}

/* -------------------------------------------------------------------------------------------------
 * Primitive
 * -----------------------------------------------------------------------------------------------*/

const Primitive = NODES.reduce((primitive, node) => {
  const Node = React.forwardRef((props: PrimitivePropsWithRef<typeof node>, forwardedRef: any) => {
    const { asChild, ...primitiveProps } = props;
    const Comp: any = asChild ? Slot : node;

    React.useEffect(() => {
      (window as any)[Symbol.for('radix-ui')] = true;
    }, []);

    return <Comp {...primitiveProps} ref={forwardedRef} />;
  });

  Node.displayName = `Primitive.${node}`;

  return { ...primitive, [node]: Node };
}, {} as Primitives);

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

/**
 * Flush custom event dispatch
 * https://github.com/radix-ui/primitives/pull/1378
 *
 * React batches *all* event handlers since version 18, this introduces certain considerations when using custom event types.
 *
 * Internally, React prioritises events in the following order:
 *  - discrete
 *  - continuous
 *  - default
 *
 * https://github.com/facebook/react/blob/a8a4742f1c54493df00da648a3f9d26e3db9c8b5/packages/react-dom/src/events/ReactDOMEventListener.js#L294-L350
 *
 * `discrete` is an  important distinction as updates within these events are applied immediately.
 * React however, is not able to infer the priority of custom event types due to how they are detected internally.
 * Because of this, it's possible for updates from custom events to be unexpectedly batched when
 * dispatched by another `discrete` event.
 *
 * In order to ensure that updates from custom events are applied predictably, we need to manually flush the batch.
 * This utility should be used when dispatching a custom event from within another `discrete` event, this utility
 * is not nessesary when dispatching known event types, or if dispatching a custom type inside a non-discrete event.
 * For example:
 *
 * dispatching a known click 👎
 * target.dispatchEvent(new Event(‘click’))
 *
 * dispatching a custom type within a non-discrete event 👎
 * onScroll={(event) => event.target.dispatchEvent(new CustomEvent(‘customType’))}
 *
 * dispatching a custom type within a `discrete` event 👍
 * onPointerDown={(event) => dispatchDiscreteCustomEvent(event.target, new CustomEvent(‘customType’))}
 *
 * Note: though React classifies `focus`, `focusin` and `focusout` events as `discrete`, it's  not recommended to use
 * this utility with them. This is because it's possible for those handlers to be called implicitly during render
 * e.g. when focus is within a component as it is unmounted, or when managing focus on mount.
 */

function dispatchDiscreteCustomEvent<E extends CustomEvent>(target: E['target'], event: E) {
  if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
}

/* -----------------------------------------------------------------------------------------------*/

const Root = Primitive;

export {
  Primitive,
  //
  Root,
  //
  dispatchDiscreteCustomEvent,
};
export type { ComponentPropsWithoutRef, PrimitivePropsWithRef };
