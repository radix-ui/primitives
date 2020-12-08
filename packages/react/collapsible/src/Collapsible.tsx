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
  defaultIsOpen?: boolean;
  isOpen?: boolean;
  disabled?: boolean;
  onToggle?(isOpen?: boolean): void;
};

type CollapsibleContextValue = {
  contentId?: string;
  setContentId(id: string): void;
  isOpen: boolean;
  isDisabled?: boolean;
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
      isOpen: isOpenProp,
      defaultIsOpen,
      disabled: isDisabled,
      onToggle,
      ...collapsibleProps
    } = props;

    const [isOpen = false, setIsOpen] = useControlledState({
      prop: isOpenProp,
      defaultProp: defaultIsOpen,
      onChange: onToggle,
    });
    const [contentId, setContentId] = React.useState<string>();
    const context = React.useMemo(
      () => ({
        contentId,
        isOpen,
        isDisabled,
        toggle: () => setIsOpen((prevIsOpen) => !prevIsOpen),
        setContentId,
      }),
      [contentId, isDisabled, isOpen, setIsOpen]
    );

    return (
      <Comp
        {...getPartDataAttrObj(COLLAPSIBLE_NAME)}
        {...collapsibleProps}
        data-state={getState(context.isOpen)}
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
      aria-expanded={context.isOpen || false}
      data-state={getState(context.isOpen)}
      {...buttonProps}
      onClick={composeEventHandlers(onClick, context.toggle)}
      disabled={context.isDisabled}
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
  const { setContentId, isOpen } = useCollapsibleContext(CONTENT_NAME);
  const generatedId = `collapsible-${useId()}`;
  const id = idProp || generatedId;

  React.useEffect(() => {
    setContentId(id);
  }, [id, setContentId]);

  return (
    <Presence present={isOpen}>
      {({ present }) => (
        <Comp
          {...contentProps}
          {...getPartDataAttrObj(CONTENT_NAME)}
          ref={forwardedRef}
          id={id}
          hidden={!present}
          data-state={getState(isOpen)}
        >
          {present && children}
        </Comp>
      )}
    </Presence>
  );
});

CollapsibleContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(isOpen?: boolean) {
  return isOpen ? 'open' : 'closed';
}

const Root = Collapsible;
const Button = CollapsibleButton;
const Content = CollapsibleContent;

export { Collapsible, CollapsibleButton, CollapsibleContent, Root, Button, Content };
