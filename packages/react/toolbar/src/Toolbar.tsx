import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const TOOLBAR_NAME = 'Toolbar';

type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type ToolbarContextValue = { orientation: RovingFocusGroupProps['orientation'] };
const [ToolbarProvider, useToolbarContext] = createContext<ToolbarContextValue>(TOOLBAR_NAME);

type ToolbarElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ToolbarProps extends PrimitiveDivProps {
  orientation?: RovingFocusGroupProps['orientation'];
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
}

const Toolbar = React.forwardRef<ToolbarElement, ToolbarProps>((props, forwardedRef) => {
  const { orientation = 'horizontal', dir = 'ltr', loop = true, ...toolbarProps } = props;
  return (
    <ToolbarProvider orientation={orientation}>
      <RovingFocusGroup asChild orientation={orientation} dir={dir} loop={loop}>
        <Primitive.div role="toolbar" dir={dir} {...toolbarProps} ref={forwardedRef} />
      </RovingFocusGroup>
    </ToolbarProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ToolbarSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ToolbarSeparator';

type ToolbarSeparatorElement = React.ElementRef<typeof SeparatorPrimitive.Root>;
type SeparatorProps = Radix.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;
interface ToolbarSeparatorProps extends SeparatorProps {}

const ToolbarSeparator = React.forwardRef<ToolbarSeparatorElement, ToolbarSeparatorProps>(
  (props, forwardedRef) => {
    const context = useToolbarContext(SEPARATOR_NAME);
    return (
      <SeparatorPrimitive.Root
        orientation={context.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        {...props}
        ref={forwardedRef}
      />
    );
  }
);

ToolbarSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'ToolbarButton';

type ToolbarButtonElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ToolbarButtonProps extends PrimitiveButtonProps {}

const ToolbarButton = React.forwardRef<ToolbarButtonElement, ToolbarButtonProps>(
  (props, forwardedRef) => (
    <RovingFocusItem asChild focusable={!props.disabled}>
      <Primitive.button role="toolbaritem" {...props} ref={forwardedRef} />
    </RovingFocusItem>
  )
);

ToolbarButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarLink
 * -----------------------------------------------------------------------------------------------*/

const LINK_NAME = 'ToolbarLink';

type ToolbarLinkElement = React.ElementRef<typeof Primitive.a>;
type PrimitiveLinkProps = Radix.ComponentPropsWithoutRef<typeof Primitive.a>;
interface ToolbarLinkProps extends PrimitiveLinkProps {}

const ToolbarLink = React.forwardRef<ToolbarLinkElement, ToolbarLinkProps>(
  (props, forwardedRef) => (
    <RovingFocusItem asChild focusable>
      <Primitive.a
        role="toolbaritem"
        {...props}
        ref={forwardedRef}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === ' ') event.currentTarget.click();
        })}
      />
    </RovingFocusItem>
  )
);

ToolbarLink.displayName = LINK_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_NAME = 'ToolbarToggleGroup';

type ToolbarToggleGroupElement = React.ElementRef<typeof ToggleGroupPrimitive.Root>;
type ToggleGroupProps = Radix.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
interface ToolbarToggleGroupSingleProps extends Extract<ToggleGroupProps, { type: 'single' }> {}
interface ToolbarToggleGroupMultipleProps extends Extract<ToggleGroupProps, { type: 'multiple' }> {}

const ToolbarToggleGroup = React.forwardRef<
  ToolbarToggleGroupElement,
  ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps
>((props, forwardedRef) => {
  const context = useToolbarContext(TOGGLE_GROUP_NAME);
  return (
    <ToggleGroupPrimitive.Root
      data-orientation={context.orientation}
      {...props}
      ref={forwardedRef}
      rovingFocus={false}
    />
  );
});

ToolbarToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleItem
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_ITEM_NAME = 'ToolbarToggleItem';

type ToolbarToggleItemElement = React.ElementRef<typeof ToggleGroupPrimitive.Item>;
type ToggleGroupItemProps = Radix.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;
interface ToolbarToggleItemProps extends ToggleGroupItemProps {}

const ToolbarToggleItem = React.forwardRef<ToolbarToggleItemElement, ToolbarToggleItemProps>(
  (props, forwardedRef) => (
    <ToolbarButton asChild disabled={props.disabled}>
      <ToggleGroupPrimitive.Item {...props} ref={forwardedRef} />
    </ToolbarButton>
  )
);

ToolbarToggleItem.displayName = TOGGLE_ITEM_NAME;

/* ---------------------------------------------------------------------------------------------- */

const Root = Toolbar;
const Separator = ToolbarSeparator;
const Button = ToolbarButton;
const Link = ToolbarLink;
const ToggleGroup = ToolbarToggleGroup;
const ToggleItem = ToolbarToggleItem;

export {
  Toolbar,
  ToolbarSeparator,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  //
  Root,
  Separator,
  Button,
  Link,
  ToggleGroup,
  ToggleItem,
};
export type {
  ToolbarProps,
  ToolbarSeparatorProps,
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarToggleGroupSingleProps,
  ToolbarToggleGroupMultipleProps,
  ToolbarToggleItemProps,
};
