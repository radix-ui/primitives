import * as React from 'react';
import {
  createContext,
  useId,
  composeEventHandlers,
  useControlledState,
} from '@radix-ui/react-utils';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Presence } from '@radix-ui/react-presence';

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible';
const COLLAPSIBLE_DEFAULT_TAG = 'div';

type CollapsibleOwnProps = {
  defaultOpen?: boolean;
  open?: boolean;
  disabled?: boolean;
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-collapsible
   */
  selector?: string | null;
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
      selector = getSelector(COLLAPSIBLE_NAME),
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
        {...collapsibleProps}
        {...getSelectorObj(selector)}
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

type CollapsibleButtonProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-collapsible-button
   */
  selector?: string | null;
};

const CollapsibleButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, CollapsibleButtonProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = BUTTON_DEFAULT_TAG,
      selector = getSelector(COLLAPSIBLE_NAME),
      onClick,
      ...buttonProps
    } = props;
    const context = useCollapsibleContext(BUTTON_NAME);

    return (
      <Comp
        aria-controls={context.contentId}
        aria-expanded={context.open || false}
        data-state={getState(context.open)}
        {...buttonProps}
        {...getSelectorObj(selector)}
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
const CONTENT_DEFAULT_TAG = 'div';

type CollapsibleContentOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-collapsible-content
   */
  selector?: string | null;
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
};

const CollapsibleContent = forwardRefWithAs<typeof CONTENT_DEFAULT_TAG, CollapsibleContentOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = CONTENT_DEFAULT_TAG,
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
          <Comp
            {...contentProps}
            {...getSelectorObj(selector)}
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
