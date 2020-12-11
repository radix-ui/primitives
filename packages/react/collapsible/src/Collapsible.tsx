import * as React from 'react';
import {
  createContext,
  useId,
  composeEventHandlers,
  useControlledState,
} from '@interop-ui/react-utils';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { Presence } from '@interop-ui/react-presence';

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible';
const COLLAPSIBLE_DEFAULT_TAG = 'div';

type CollapsibleOwnProps = {
  defaultOpen?: boolean;
  open?: boolean;
  disabled?: boolean;
  onOpenChange?(open?: boolean): void;
};

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

const Collapsible = forwardRefWithAs<typeof COLLAPSIBLE_DEFAULT_TAG, CollapsibleOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = COLLAPSIBLE_DEFAULT_TAG,
      id: idProp,
      children,
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
      <Comp
        {...getPartDataAttrObj(COLLAPSIBLE_NAME)}
        {...collapsibleProps}
        data-state={getState(context.open)}
        ref={forwardedRef}
      >
        <CollapsibleContext.Provider value={context}>{children}</CollapsibleContext.Provider>
      </Comp>
    );
  }
);

Collapsible.displayName = COLLAPSIBLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'CollapsibleButton';
const BUTTON_DEFAULT_TAG = 'button';

const CollapsibleButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = BUTTON_DEFAULT_TAG, onClick, ...buttonProps } = props;
  const context = useCollapsibleContext(BUTTON_NAME);

  return (
    <Comp
      {...getPartDataAttrObj(BUTTON_NAME)}
      ref={forwardedRef}
      aria-controls={context.contentId}
      aria-expanded={context.open || false}
      data-state={getState(context.open)}
      {...buttonProps}
      onClick={composeEventHandlers(onClick, context.toggle)}
      disabled={context.disabled}
    />
  );
});

CollapsibleButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'CollapsibleContent';
const CONTENT_DEFAULT_TAG = 'div';

const CollapsibleContent = forwardRefWithAs<typeof CONTENT_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = CONTENT_DEFAULT_TAG, id: idProp, children, ...contentProps } = props;
  const { setContentId, open } = useCollapsibleContext(CONTENT_NAME);
  const generatedId = `collapsible-${useId()}`;
  const id = idProp || generatedId;

  React.useEffect(() => {
    setContentId(id);
  }, [id, setContentId]);

  return (
    <Presence present={open}>
      {({ present }) => (
        <Comp
          {...contentProps}
          {...getPartDataAttrObj(CONTENT_NAME)}
          ref={forwardedRef}
          id={id}
          hidden={!present}
          data-state={getState(open)}
        >
          {present && children}
        </Comp>
      )}
    </Presence>
  );
});

CollapsibleContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(open?: boolean) {
  return open ? 'open' : 'closed';
}

const Root = Collapsible;
const Button = CollapsibleButton;
const Content = CollapsibleContent;

export { Collapsible, CollapsibleButton, CollapsibleContent, Root, Button, Content };
