import * as React from 'react';
import {
  createContext,
  useId,
  composeEventHandlers,
  useControlledState,
} from '@radix-ui/react-utils';
import { getSelector } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';
import { Presence } from '@radix-ui/react-presence';

import type { OwnProps } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible';

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

const Collapsible = forwardRefWithAs<typeof Primitive, CollapsibleOwnProps>(
  (props, forwardedRef) => {
    const {
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
      <Primitive
        selector={getSelector(COLLAPSIBLE_NAME)}
        {...collapsibleProps}
        data-state={getState(context.open)}
        ref={forwardedRef}
      >
        <CollapsibleContext.Provider value={context}>{children}</CollapsibleContext.Provider>
      </Primitive>
    );
  }
);

Collapsible.displayName = COLLAPSIBLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'CollapsibleButton';
const BUTTON_DEFAULT_TAG = 'button';

const CollapsibleButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, OwnProps<typeof Primitive>>(
  (props, forwardedRef) => {
    const { onClick, ...buttonProps } = props;
    const context = useCollapsibleContext(BUTTON_NAME);

    return (
      <Primitive
        as={BUTTON_DEFAULT_TAG}
        selector={getSelector(BUTTON_NAME)}
        aria-controls={context.contentId}
        aria-expanded={context.open || false}
        data-state={getState(context.open)}
        {...buttonProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, context.toggle)}
        disabled={context.disabled}
      />
    );
  }
);

CollapsibleButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'CollapsibleContent';

type CollapsibleContentOwnProps = {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
};

const CollapsibleContent = forwardRefWithAs<typeof Primitive, CollapsibleContentOwnProps>(
  (props, forwardedRef) => {
    const { id: idProp, forceMount, children, ...contentProps } = props;
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
            selector={getSelector(CONTENT_NAME)}
            {...contentProps}
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
  }
);

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
