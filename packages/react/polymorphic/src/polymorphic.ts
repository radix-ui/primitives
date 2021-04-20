import * as React from 'react';

/* -------------------------------------------------------------------------------------------------
 * Utility types
 * -----------------------------------------------------------------------------------------------*/
type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;
type MergeWithRefProps<E, P = {}> = P &
  Merge<E extends React.ElementType ? React.ComponentPropsWithRef<E> : never, P>;

/**
 * Infers the OwnProps if E is a ForwardRefExoticComponentWithAs
 */
type OwnProps<E> = E extends ForwardRefComponent<any, infer P> ? P : {};

/**
 * Infers the JSX.IntrinsicElement if E is a ForwardRefExoticComponentWithAs
 */
type IntrinsicElement<E> = E extends ForwardRefComponent<infer I, any> ? I : never;

type NarrowIntrinsic<E> = E extends keyof JSX.IntrinsicElements ? E : never;

/* -------------------------------------------------------------------------------------------------
 * ForwardRefComponent
 * -----------------------------------------------------------------------------------------------*/

interface ForwardRefComponent<
  IntrinsicElementString,
  OwnProps = {}
  /**
   * Extends original type to ensure built in React types play nice
   * with polymorphic components still e.g. `React.ElementRef` etc.
   */
> extends React.ForwardRefExoticComponent<
    MergeWithRefProps<IntrinsicElementString, OwnProps & { as?: IntrinsicElementString }>
  > {
  /**
   * When `as` prop is passed, use this overload.
   * Merges original own props (without DOM props) and the inferred props
   * from `as` element with the own props taking precendence.
   *
   * We explicitly avoid `React.ElementType` and manually narrow the prop types
   * so that events are typed when using JSX.IntrinsicElements.
   */
  <
    As extends
      | keyof JSX.IntrinsicElements
      | React.JSXElementConstructor<any> = NarrowIntrinsic<IntrinsicElementString>
  >(
    props: As extends keyof JSX.IntrinsicElements
      ? Merge<JSX.IntrinsicElements[As], OwnProps & { as: As }>
      : As extends React.JSXElementConstructor<infer P>
      ? Merge<P, OwnProps & { as: As }>
      : never
  ): React.ReactElement | null;
}

export type { ForwardRefComponent, OwnProps, IntrinsicElement, Merge };
