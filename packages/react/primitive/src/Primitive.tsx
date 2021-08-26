import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

const NODES = ['a', 'button', 'div', 'h2', 'h3', 'p', 'img', 'span', 'svg'] as const;

type MergeProps<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;
type Primitives = { [E in typeof NODES[number]]: PrimitiveForwardRefComponent<E> };

type PrimitiveForwardRefComponent<E extends React.ElementType> = React.ForwardRefExoticComponent<
  MergeProps<React.ComponentProps<E>, PrimitiveProps>
>;

/* -------------------------------------------------------------------------------------------------
 * Primitive
 * -----------------------------------------------------------------------------------------------*/

type PrimitiveProps = { asChild?: boolean };

const Primitive = NODES.reduce(
  (primitive, node) => ({
    ...primitive,
    [node]: React.forwardRef((props: PrimitiveProps, forwardedRef: any) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? Slot : node;
      if ((props as any).as) console.error(AS_ERROR);
      return <Comp {...primitiveProps} ref={forwardedRef} />;
    }),
  }),
  {} as Primitives
);

/* -----------------------------------------------------------------------------------------------*/

const AS_ERROR = `Warning: The \`as\` prop has been removed in favour of \`asChild\`. For details, see https://radix-ui.com/`;

const Root = Primitive;

export {
  Primitive,
  //
  Root,
};
export type { MergeProps };
