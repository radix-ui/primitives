import * as React from 'react';
import { ElementTagNameMap } from '@interop-ui/utils';

// The following types help us deal with the `as` prop.
// We probably want to write some tests for these!

export type As<BaseProps = any> = React.ElementType<BaseProps>;

export type PropsWithAs<ComponentType extends As, ComponentProps> = ComponentProps &
  Omit<React.ComponentPropsWithRef<ComponentType>, 'as' | keyof ComponentProps> & {
    as?: ComponentType;
  };

export type PropsFromAs<ComponentType extends As, ComponentProps> = (PropsWithAs<
  ComponentType,
  ComponentProps
> & { as: ComponentType }) &
  PropsWithAs<ComponentType, ComponentProps>;

export interface FunctionComponentWithAs<ComponentType extends As, ComponentProps> {
  /**
   * Inherited from React.FunctionComponent with modifications to support `as`
   */
  <TT extends As>(props: PropsWithAs<TT, ComponentProps>, context?: any): React.ReactElement<
    any,
    any
  > | null;
  (props: PropsWithAs<ComponentType, ComponentProps>, context?: any): React.ReactElement<
    any,
    any
  > | null;

  /**
   * Inherited from React.FunctionComponent
   */
  displayName?: string;
  propTypes?: React.WeakValidationMap<PropsWithAs<ComponentType, ComponentProps>>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<PropsWithAs<ComponentType, ComponentProps>>;
}

export interface ExoticComponentWithAs<ComponentType extends As, ComponentProps> {
  /**
   * **NOTE**: Exotic components are not callable.
   * Inherited from React.ExoticComponent with modifications to support `as`
   */
  <TT extends As>(props: PropsWithAs<TT, ComponentProps>): React.ReactElement | null;
  (props: PropsWithAs<ComponentType, ComponentProps>): React.ReactElement | null;

  /**
   * Inherited from React.ExoticComponent
   */
  readonly $$typeof: symbol;
}

interface NamedExoticComponentWithAs<ComponentType extends As, ComponentProps>
  extends ExoticComponentWithAs<ComponentType, ComponentProps> {
  /**
   * Inherited from React.NamedExoticComponent
   */
  displayName?: string;
}

export interface ForwardRefExoticComponentWithAs<ComponentType extends As, ComponentProps>
  extends NamedExoticComponentWithAs<ComponentType, ComponentProps> {
  /**
   * Inherited from React.ForwardRefExoticComponent
   * Will show `ForwardRef(${Component.displayName || Component.name})` in devtools by default,
   * but can be given its own specific name
   */
  defaultProps?: Partial<PropsWithAs<ComponentType, ComponentProps>>;
  propTypes?: React.WeakValidationMap<PropsWithAs<ComponentType, ComponentProps>>;
}

export interface MemoExoticComponentWithAs<ComponentType extends As, ComponentProps>
  extends NamedExoticComponentWithAs<ComponentType, ComponentProps> {
  readonly type: ComponentType extends React.ComponentType
    ? ComponentType
    : FunctionComponentWithAs<ComponentType, ComponentProps>;
}

export interface ForwardRefWithAsRenderFunction<ComponentType extends As, ComponentProps = {}> {
  (
    props: React.PropsWithChildren<PropsFromAs<ComponentType, ComponentProps>>,
    ref:
      | ((
          instance:
            | (ComponentType extends keyof ElementTagNameMap ? ElementByTag<ComponentType> : any)
            | null
        ) => void)
      | React.MutableRefObject<
          (ComponentType extends keyof ElementTagNameMap ? ElementByTag<ComponentType> : any) | null
        >
      | null
  ): React.ReactElement | null;
  displayName?: string;
  // explicit rejected with `never` required due to
  // https://github.com/microsoft/TypeScript/issues/36826
  /**
   * defaultProps are not supported on render functions
   */
  defaultProps?: never;
  /**
   * propTypes are not supported on render functions
   */
  propTypes?: never;
}

export type ElementByTag<TagName extends keyof ElementTagNameMap> = ElementTagNameMap[TagName];
