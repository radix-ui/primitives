import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope } from '@radix-ui/react-context';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { createToggleGroupScope } from '@radix-ui/react-toggle-group';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const TOOLBAR_NAME = 'Toolbar';

const [createToolbarContext, removeToolbarScopeProps, createToolbarScope] = createContextScope(
  TOOLBAR_NAME,
  [createRovingFocusGroupScope, createToggleGroupScope]
);
const useRovingFocusGroupScope = createRovingFocusGroupScope();
const useToggleGroupScope = createToggleGroupScope();

type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type ToolbarContextValue = { orientation: RovingFocusGroupProps['orientation'] };
const [ToolbarProvider, useToolbarContext] =
  createToolbarContext<ToolbarContextValue>(TOOLBAR_NAME);

type ToolbarElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ToolbarProps extends PrimitiveDivProps {
  orientation?: RovingFocusGroupProps['orientation'];
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
}

const Toolbar = React.forwardRef<ToolbarElement, ToolbarProps>((props, forwardedRef) => {
  const { orientation = 'horizontal', dir = 'ltr', loop = true, ...toolbarProps } = props;
  const rovingFocusGroupScope = useRovingFocusGroupScope(TOOLBAR_NAME, props);
  return (
    <ToolbarProvider scope={props} orientation={orientation}>
      <RovingFocusGroup.Root
        asChild
        {...rovingFocusGroupScope}
        orientation={orientation}
        dir={dir}
        loop={loop}
      >
        <Primitive.div
          role="toolbar"
          dir={dir}
          {...removeToolbarScopeProps(toolbarProps)}
          ref={forwardedRef}
        />
      </RovingFocusGroup.Root>
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
    const context = useToolbarContext(SEPARATOR_NAME, props);
    return (
      <SeparatorPrimitive.Root
        orientation={context.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        {...removeToolbarScopeProps(props)}
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
  (props, forwardedRef) => {
    const rovingFocusGroupScope = useRovingFocusGroupScope(BUTTON_NAME, props);
    return (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!props.disabled}>
        <Primitive.button
          role="toolbaritem"
          {...removeToolbarScopeProps(props)}
          ref={forwardedRef}
        />
      </RovingFocusGroup.Item>
    );
  }
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
  (props, forwardedRef) => {
    const rovingFocusGroupScope = useRovingFocusGroupScope(LINK_NAME, props);
    return (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable>
        <Primitive.a
          role="toolbaritem"
          {...removeToolbarScopeProps(props)}
          ref={forwardedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (event.key === ' ') event.currentTarget.click();
          })}
        />
      </RovingFocusGroup.Item>
    );
  }
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
  const context = useToolbarContext(TOGGLE_GROUP_NAME, props);
  const toggleGroupScope = useToggleGroupScope(TOGGLE_GROUP_NAME, props);
  return (
    <ToggleGroupPrimitive.Root
      data-orientation={context.orientation}
      {...toggleGroupScope}
      {...removeToolbarScopeProps(props)}
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
  (props, forwardedRef) => {
    const toggleGroupScope = useToggleGroupScope(TOGGLE_ITEM_NAME, props);
    return (
      <ToolbarButton asChild {...props}>
        <ToggleGroupPrimitive.Item
          {...toggleGroupScope}
          {...removeToolbarScopeProps(props)}
          ref={forwardedRef}
        />
      </ToolbarButton>
    );
  }
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
  createToolbarScope,
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
