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

type ToolbarElement = React.ComponentRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ToolbarProps extends PrimitiveDivProps {
  orientation?: RovingFocusGroupProps['orientation'];
  loop?: RovingFocusGroupProps['loop'];
  dir?: RovingFocusGroupProps['dir'];
}

const Toolbar = /* @__PURE__ */ React.forwardRef<ToolbarElement, ToolbarProps>(
  // blank line to reduce diff noise
  function Toolbar(props: ScopedProps<ToolbarProps>, forwardedRef) {
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * ToolbarSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ToolbarSeparator';

type ToolbarSeparatorElement = React.ComponentRef<typeof SeparatorPrimitive.Root>;
type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;
interface ToolbarSeparatorProps extends SeparatorProps {}

const ToolbarSeparator = /* @__PURE__ */ React.forwardRef<
  ToolbarSeparatorElement,
  ToolbarSeparatorProps
>(
  // blank line to reduce diff noise
  function ToolbarSeparator(props: ScopedProps<ToolbarSeparatorProps>, forwardedRef) {
    const { __scopeToolbar, ...separatorProps } = props;
    const context = useToolbarContext(SEPARATOR_NAME, __scopeToolbar);
    return (
      <SeparatorPrimitive.Root
        orientation={context.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        {...separatorProps}
        ref={forwardedRef}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * ToolbarButton
 * -----------------------------------------------------------------------------------------------*/

type ToolbarButtonElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ToolbarButtonProps extends PrimitiveButtonProps {}

const ToolbarButton = /* @__PURE__ */ React.forwardRef<ToolbarButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props: ScopedProps<ToolbarButtonProps>, forwardedRef) {
    const { __scopeToolbar, ...buttonProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToolbar);
    return (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable={!props.disabled}>
        <Primitive.button type="button" {...buttonProps} ref={forwardedRef} />
      </RovingFocusGroup.Item>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * ToolbarLink
 * -----------------------------------------------------------------------------------------------*/

type ToolbarLinkElement = React.ComponentRef<typeof Primitive.a>;
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>;
interface ToolbarLinkProps extends PrimitiveLinkProps {}

const ToolbarLink = /* @__PURE__ */ React.forwardRef<ToolbarLinkElement, ToolbarLinkProps>(
  function ToolbarLink(props: ScopedProps<ToolbarLinkProps>, forwardedRef) {
    const { __scopeToolbar, ...linkProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToolbar);
    return (
      <RovingFocusGroup.Item asChild {...rovingFocusGroupScope} focusable>
        <Primitive.a
          {...linkProps}
          ref={forwardedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            // Only react to keys originating from the link itself. Focusable
            // descendants (eg. content portaled out of the link's DOM subtree)
            // bubble their key events here through React's event system.
            // See: https://github.com/radix-ui/primitives/issues/3232
            if (event.target !== event.currentTarget) {
              return;
            }

            if (event.key === ' ') {
              event.currentTarget.click();
            }
          })}
        />
      </RovingFocusGroup.Item>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_NAME = 'ToolbarToggleGroup';

type ToolbarToggleGroupElement = React.ComponentRef<typeof ToggleGroupPrimitive.Root>;
type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
interface ToolbarToggleGroupSingleProps extends Extract<ToggleGroupProps, { type: 'single' }> {}
interface ToolbarToggleGroupMultipleProps extends Extract<ToggleGroupProps, { type: 'multiple' }> {}

const ToolbarToggleGroup = /* @__PURE__ */ React.forwardRef<
  ToolbarToggleGroupElement,
  ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps
>(
  // blank line to reduce diff noise
  function ToolbarToggleGroup(
    props: ScopedProps<ToolbarToggleGroupSingleProps | ToolbarToggleGroupMultipleProps>,
    forwardedRef,
  ) {
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleItem
 * -----------------------------------------------------------------------------------------------*/

type ToolbarToggleItemElement = React.ComponentRef<typeof ToggleGroupPrimitive.Item>;
type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;
interface ToolbarToggleItemProps extends ToggleGroupItemProps {}

const ToolbarToggleItem = /* @__PURE__ */ React.forwardRef<
  ToolbarToggleItemElement,
  ToolbarToggleItemProps
>(
  // blank line to reduce diff noise
  function ToolbarToggleItem(props: ScopedProps<ToolbarToggleItemProps>, forwardedRef) {
    const { __scopeToolbar, ...toggleItemProps } = props;
    const toggleGroupScope = useToggleGroupScope(__scopeToolbar);
    const scope = { __scopeToolbar: props.__scopeToolbar };

    return (
      <ToolbarButton asChild {...scope}>
        <ToggleGroupPrimitive.Item {...toggleGroupScope} {...toggleItemProps} ref={forwardedRef} />
      </ToolbarButton>
    );
  },
);

/* ---------------------------------------------------------------------------------------------- */

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
  Toolbar as Root,
  ToolbarSeparator as Separator,
  ToolbarButton as Button,
  ToolbarLink as Link,
  ToolbarToggleGroup as ToggleGroup,
  ToolbarToggleItem as ToggleItem,
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
