import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

const NODES = [
  'a',
  'button',
  'div',
  'h2',
  'h3',
  'img',
  'li',
  'nav',
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

const Primitive = NODES.reduce(
  (primitive, node) => ({
    ...primitive,
    [node]: React.forwardRef((props: PrimitivePropsWithRef<typeof node>, forwardedRef: any) => {
      const { asChild, ...primitiveProps } = props;
      const Comp: any = asChild ? Slot : node;

      React.useEffect(() => {
        (window as any)[Symbol.for('radix-ui')] = true;
      }, []);

      // DEPRECATED
      if ((props as any).as) console.error(AS_ERROR);
      return <Comp {...primitiveProps} ref={forwardedRef} />;
    }),
  }),
  {} as Primitives
);

/* -----------------------------------------------------------------------------------------------*/

const AS_ERROR = `Warning: The \`as\` prop has been removed in favour of \`asChild\`. For details, see https://radix-ui.com/docs/primitives/overview/styling#changing-the-rendered-element`;

const Root = Primitive;

export {
  Primitive,
  //
  Root,
};
export type { ComponentPropsWithoutRef, PrimitivePropsWithRef };
