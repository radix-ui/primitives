import * as React from 'react';
import {
  createContext,
  useId,
  composeEventHandlers,
  useControlledState,
} from '@radix-ui/react-utils';
import { getSelector } from '@radix-ui/utils';
import { Primitive } from '@radix-ui/react-primitive';
import { Presence } from '@radix-ui/react-presence';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible';

type CollapsibleOwnProps = Merge<
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
  contentId?: string;
  setContentId(id: string): void;
  open: boolean;
  disabled?: boolean;
  toggle(): void;
};

const [CollapsibleContext, useCollapsibleContext] = createContext<CollapsibleContextValue>(
  'CollapsibleContext',
  COLLAPSIBLE_NAME
);

const Collapsible = React.forwardRef((props, forwardedRef) => {
  const {
    selector = getSelector(COLLAPSIBLE_NAME),
    id: idProp,
    open: openProp,
    defaultOpen,
    disabled,
    onOpenChange,
    ...collapsibleProps
  } = props;

  const [open = false, setOpen] = useControlledState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [contentId, setContentId] = React.useState<string>();
  const context = React.useMemo(
    () => ({
      contentId,
      open,
      disabled,
      toggle: () => setOpen((prevOpen) => !prevOpen),
      setContentId,
    }),
    [contentId, disabled, open, setOpen]
  );

  return (
    <CollapsibleContext.Provider value={context}>
      <Primitive
        {...collapsibleProps}
        selector={selector}
        data-state={getState(context.open)}
        ref={forwardedRef}
      />
    </CollapsibleContext.Provider>
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
  const {
    as = BUTTON_DEFAULT_TAG,
    selector = getSelector(BUTTON_NAME),
    onClick,
    ...buttonProps
  } = props;
  const context = useCollapsibleContext(BUTTON_NAME);

  return (
    <Primitive
      aria-controls={context.contentId}
      aria-expanded={context.open || false}
      data-state={getState(context.open)}
      {...buttonProps}
      as={as}
      selector={selector}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, context.toggle)}
      disabled={context.disabled}
    />
  );
}) as CollapsibleButtonPrimitive;

CollapsibleButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'CollapsibleContent';

type CollapsibleContentOwnProps = Merge<
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
  const {
    selector = getSelector(CONTENT_NAME),
    id: idProp,
    forceMount,
    children,
    ...contentProps
  } = props;
  const { setContentId, open } = useCollapsibleContext(CONTENT_NAME);
  const generatedId = `collapsible-${useId()}`;
  const id = idProp || generatedId;

  React.useEffect(() => {
    setContentId(id);
  }, [id, setContentId]);

  return (
    <Presence present={forceMount || open}>
      {({ present }) => (
        <Primitive
          {...contentProps}
          selector={selector}
          ref={forwardedRef}
          id={id}
          hidden={!present}
          data-state={getState(open)}
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
