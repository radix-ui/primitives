import * as React from 'react';

/* -------------------------------------------------------------------------------------------------
 * Utility types
 * -----------------------------------------------------------------------------------------------*/
type MergeProps<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;

type MergeWithDOMProps<E extends React.ElementType, P = {}> = MergeProps<
  React.ComponentPropsWithRef<E>,
  P
>;

/* -------------------------------------------------------------------------------------------------
 * ForwardRefExoticComponentWithAs
 * -----------------------------------------------------------------------------------------------*/

interface ForwardRefExoticComponentWithAs<
  DefaultElement extends keyof JSX.IntrinsicElements,
  OwnProps
  /**
   * Extends original type to ensure built in React types play nice
   * with polymorphic components still e.g. `React.ElementRef` etc.
   */
> extends React.ForwardRefExoticComponent<
    MergeWithDOMProps<DefaultElement, OwnProps & { as?: DefaultElement }>
  > {
  /**
   * When passing an `as` prop as a string, use this overload.
   * Merges orignal own props (without DOM props) and the inferred props
   * from `as` element with the own props taking precendence.
   *
   * We explicitly define a `JSX.IntrinsicElements` overload so that
   * events are typed for consumers.
   */
  <As extends keyof JSX.IntrinsicElements>(
    props: MergeWithDOMProps<As, OwnProps & { as: As }>
  ): JSX.Element;

  /**
   * When passing an `as` prop as a component, use this overload.
   * Merges orignal own props (without DOM props) and the inferred props
   * from `as` element with the own props taking precendence.
   *
   * We don't use `React.ComponentType` here as we get type errors
   * when consumers try to do inline `as` components.
   */
  <As extends React.ElementType<any>>(
    props: MergeWithDOMProps<As, OwnProps & { as: As }>
  ): JSX.Element;
}

/* -------------------------------------------------------------------------------------------------
 * forwardRefWithAs
 * -----------------------------------------------------------------------------------------------*/

/**
 * Infers the JSX.IntrinsicElement if E is a ForwardRefExoticComponentWithAs
 */
type IntrinsicElement<E> = E extends ForwardRefExoticComponentWithAs<infer T, any> ? T : E;

/**
 * If E is a ForwardRefExoticComponentWithAs then we know we are trying to forward to
 * a polymorphic component. When this happens we merge the new polymorphic's OwnProps
 * with the original polymorphic's OwnProps, ensuring the new props take precedence.
 */
type ExtendedProps<E, OwnProps> = E extends ForwardRefExoticComponentWithAs<any, infer P>
  ? MergeProps<P, OwnProps>
  : OwnProps;

/**
 * @example when creating a new polymorphic component
 * const Box = forwardRefWithAs<'div', { variant?: Variant }>()
 *
 * @example when extending an existing polymorphic component
 * const Flex = forwardRefWithAs<typeof Box, { direction?: FlexDirection }>()
 */
function forwardRefWithAs<
  E extends keyof JSX.IntrinsicElements | ForwardRefExoticComponentWithAs<any, any>,
  OwnProps = {}
>(
  component: React.ForwardRefRenderFunction<
    React.ElementRef<IntrinsicElement<E>>,
    MergeProps<
      React.ComponentPropsWithoutRef<IntrinsicElement<E>>,
      ExtendedProps<E, OwnProps> & { as?: IntrinsicElement<E> }
    >
  >
) {
  return React.forwardRef(component) as ForwardRefExoticComponentWithAs<
    IntrinsicElement<E>,
    ExtendedProps<E, OwnProps>
  >;
}

export { forwardRefWithAs };
export type { ForwardRefExoticComponentWithAs };
