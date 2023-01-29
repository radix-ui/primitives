import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope } from '@radix-ui/react-context';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { createToggleGroupScope } from '@radix-ui/react-toggle-group';
import { useDirection } from '@radix-ui/react-direction';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * -----------------------------------------------------------------------------------------------*/

const TOOLBAR_NAME = 'Toolbar';

type ScopedProps<P> = P & { __scopeToolbar?: Scope };
const [createToolbarContext, createToolbarScope] = createContextScope(TOOLBAR_NAME, [
  createRovingFocusGroupScope,
  createToggleGroupScope,
]);
const useRovingFocusGroupScope = createRovingFocusGroupScope();
const useToggleGroupScope = createToggleGroupScope();

type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type ToolbarContextValue = {
  orientation: RovingFocusGroupProps['orientation'];
  dir: RovingFocusGroupProps['dir'];
};
const [ToolbarProvider, useToolbarContext] =
  createToolbarContext<ToolbarContextValue>(TOOLBAR_NAME);

type ToolbarElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ToolbarProps extends PrimitiveDivProps {
  orientation?: RovingFocusGroupProps['orientation'];
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
}

const Toolbar = React.forwardRef<ToolbarElement, ToolbarProps>(
  (props: ScopedProps<ToolbarProps>, forwardedRef) => {
    const { __scopeToolbar, orientation = 'horizontal', dir, loop = true, ...toolbarProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToolbar);
    const direction = useDirection(dir);
    return (
      <ToolbarProvider scope={__scopeToolbar} orientation={orientation} dir={direction}>
        <RovingFocusGroup.Root
          asChild
          {...rovingFocusGroupScope}
          orientation={orientation}
          dir={direction}
          loop={loop}
        >
          <Primitive.div
            role="toolbar"
            aria-orientation={orientation}
            dir={direction}
            {...toolbarProps}
            ref={forwardedRef}
          />
        </RovingFocusGroup.Root>
      </ToolbarProvider>
    );
  }
);

Toolbar.displayName = TOOLBAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ToolbarSeparator';

type ToolbarSeparatorElement = React.ElementRef<typeof SeparatorPrimitive.Root>;
type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;
interface ToolbarSeparatorProps extends SeparatorProps {}

const ToolbarSeparator = React.forwardRef<ToolbarSeparatorElement, ToolbarSeparatorProps>(
  (props: ScopedProps<ToolbarSeparatorProps>, forwardedRef) => {
    const { __scopeToolbar, ...separatorProps } = props;
    const context = useToolbarContext(SEPARATOR_NAME, __scopeToolbar);
    return (
      <SeparatorPrimitive.Root
        orientation={context.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        {...separatorProps}
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
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ToolbarButtonProps extends PrimitiveButtonProps {}

const ToolbarButton = React.forwardRef<ToolbarButtonElement, ToolbarButtonProps>(
  (props: ScopedProps<ToolbarButtonProps>, forwardedRef) => {
    const { __scopeToolbar, ...buttonProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToolbar);
    return (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!props.disabled}>
        <Primitive.button type="button" {...buttonProps} ref={forwardedRef} />
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
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>;
interface ToolbarLinkProps extends PrimitiveLinkProps {}

const ToolbarLink = React.forwardRef<ToolbarLinkElement, ToolbarLinkProps>(
  (props: ScopedProps<ToolbarLinkProps>, forwardedRef) => {
    const { __scopeToolbar, ...linkProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToolbar);
    return (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable>
        <Primitive.a
          {...linkProps}
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
type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
interface ToolbarToggleGroupSingleProps extends Extract<ToggleGroupProps, { type: 'single' }> {}
interface ToolbarToggleGroupMultipleProps extends Extract<ToggleGroupProps, { type: 'multiple' }> {}

const ToolbarToggleGroup = React.forwardRef<
  ToolbarToggleGroupElement,
  ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps
>(
  (
    props: ScopedProps<ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps>,
    forwardedRef
  ) => {
    const { __scopeToolbar, ...toggleGroupProps } = props;
    const context = useToolbarContext(TOGGLE_GROUP_NAME, __scopeToolbar);
    const toggleGroupScope = useToggleGroupScope(__scopeToolbar);
    return (
      <ToggleGroupPrimitive.Root
        data-orientation={context.orientation}
        dir={context.dir}
        {...toggleGroupScope}
        {...toggleGroupProps}
        ref={forwardedRef}
        rovingFocus={false}
      />
    );
  }
);

ToolbarToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleItem
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_ITEM_NAME = 'ToolbarToggleItem';

type ToolbarToggleItemElement = React.ElementRef<typeof ToggleGroupPrimitive.Item>;
type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;
interface ToolbarToggleItemProps extends ToggleGroupItemProps {}

const ToolbarToggleItem = React.forwardRef<ToolbarToggleItemElement, ToolbarToggleItemProps>(
  (props: ScopedProps<ToolbarToggleItemProps>, forwardedRef) => {
    const { __scopeToolbar, ...toggleItemProps } = props;
    const toggleGroupScope = useToggleGroupScope(__scopeToolbar);
    const scope = { __scopeToolbar: props.__scopeToolbar };

    return (
      <ToolbarButton asChild {...scope}>
        <ToggleGroupPrimitive.Item {...toggleGroupScope} {...toggleItemProps} ref={forwardedRef} />
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
  //
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
