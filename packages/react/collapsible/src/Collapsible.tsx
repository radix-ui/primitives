import * as React from 'react';
import { createContextObj, composeEventHandlers, useControlledState } from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { Presence } from '@radix-ui/react-presence';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible';

type CollapsibleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    defaultOpen?: boolean;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?(open?: boolean): void;
  }
>;

type CollapsiblePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  CollapsibleOwnProps
>;

type CollapsibleContextValue = {
  contentId: string;
  disabled?: boolean;
  open: boolean;
  onOpenToggle(): void;
};

const [CollapsibleProvider, useCollapsibleContext] = createContextObj<CollapsibleContextValue>(
  COLLAPSIBLE_NAME
);

const Collapsible = React.forwardRef((props, forwardedRef) => {
  const { open: openProp, defaultOpen, disabled, onOpenChange, ...collapsibleProps } = props;

  const [open = false, setOpen] = useControlledState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <CollapsibleProvider
      disabled={disabled}
      contentId={useId()}
      open={open}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
    >
      <Primitive
        data-state={getState(open)}
        data-disabled={disabled ? '' : undefined}
        {...collapsibleProps}
        ref={forwardedRef}
      />
    </CollapsibleProvider>
  );
}) as CollapsiblePrimitive;

Collapsible.displayName = COLLAPSIBLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'CollapsibleButton';
const BUTTON_DEFAULT_TAG = 'button';

type CollapsibleButtonOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type CollapsibleButtonPrimitive = Polymorphic.ForwardRefComponent<
  typeof BUTTON_DEFAULT_TAG,
  CollapsibleButtonOwnProps
>;

const CollapsibleButton = React.forwardRef((props, forwardedRef) => {
  const { as = BUTTON_DEFAULT_TAG, onClick, ...buttonProps } = props;
  const context = useCollapsibleContext(BUTTON_NAME);

  return (
    <Primitive
      aria-controls={context.contentId}
      aria-expanded={context.open || false}
      data-state={getState(context.open)}
      data-disabled={context.disabled ? '' : undefined}
      {...buttonProps}
      as={as}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, context.onOpenToggle)}
      disabled={context.disabled}
    />
  );
}) as CollapsibleButtonPrimitive;

CollapsibleButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'CollapsibleContent';

type CollapsibleContentOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type CollapsibleContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  CollapsibleContentOwnProps
>;

const CollapsibleContent = React.forwardRef((props, forwardedRef) => {
  const { forceMount, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME);

  return (
    <Presence present={forceMount || context.open}>
      {({ present }) => (
        <Primitive
          data-state={getState(context.open)}
          data-disabled={context.disabled ? '' : undefined}
          id={context.contentId}
          {...contentProps}
          ref={forwardedRef}
          hidden={!present}
        >
          {present && children}
        </Primitive>
      )}
    </Presence>
  );
}) as CollapsibleContentPrimitive;

CollapsibleContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(open?: boolean) {
  return open ? 'open' : 'closed';
}

const Root = Collapsible;
const Button = CollapsibleButton;
const Content = CollapsibleContent;

export {
  Collapsible,
  CollapsibleButton,
  CollapsibleContent,
  //
  Root,
  Button,
  Content,
};
