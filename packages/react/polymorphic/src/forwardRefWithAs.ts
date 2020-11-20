import * as React from 'react';

type MergeProps<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;

/**
 * Merges default props and the inferred props from `as` element with the inferred
 * props taking precendence. The DOM attributes from the default element (`T`) will
 * also be removed (e.g. `form` from `button`) because, for example, the `InferredProps`
 * might be for an anchor which has no `form` attribute. We'd end up with an anchor
 * that accepts `href` *and* `form` otherwise.
 */
type MergePropsWithoutAs<T, DefaultProps, InferredProps> = Omit<
  MergeProps<Omit<DefaultProps, keyof T>, InferredProps>,
  'as'
>;

export interface ForwardRefExoticComponentWithAs<T, P = {}> extends React.ForwardRefExoticComponent<P> {
  /**
   * When passing an `as` prop as a string, use this overload
   */
  <As extends keyof JSX.IntrinsicElements>(
    props: { as: As } & MergePropsWithoutAs<T, P, JSX.IntrinsicElements[As]>
  ): JSX.Element;
  /**
   * When passing an `as` prop as a component, use this overload
   */
  <As extends React.ComponentType<any>>(
    props: {
      as: As;
    } & MergePropsWithoutAs<T, P, As extends React.ComponentType<infer Props> ? Props : {}>
  ): JSX.Element;
}

export function forwardRefWithAs<T extends Element, P = {}>(
  component: React.ForwardRefRenderFunction<T, P & { as?: React.ComponentType<Partial<P>> }>
) {
  return React.forwardRef(component) as ForwardRefExoticComponentWithAs<
    T,
    React.PropsWithoutRef<P> & React.RefAttributes<T>
  >;
}
