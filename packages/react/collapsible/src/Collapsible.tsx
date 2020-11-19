import * as React from 'react';
import {
  createContext,
  forwardRef,
  useId,
  composeEventHandlers,
  useControlledState,
} from '@interop-ui/react-utils';
import { getPartDataAttrObj } from '@interop-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type CollapsibleContextValue = {
  contentId?: string;
  setContentId(id: string): void;
  isOpen?: boolean;
  isDisabled?: boolean;
  toggle(): void;
};

const [CollapsibleContext, useCollapsibleContext] = createContext<CollapsibleContextValue>(
  'CollapsibleContext',
  'Collapsible'
);

/* -------------------------------------------------------------------------------------------------
 * CollapsibleButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'Collapsible.Button';
const BUTTON_DEFAULT_TAG = 'button';

type CollapsibleButtonDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_DEFAULT_TAG>;
type CollapsibleButtonOwnProps = {};
type CollapsibleButtonProps = CollapsibleButtonDOMProps & CollapsibleButtonOwnProps;

const CollapsibleButton = forwardRef<typeof BUTTON_DEFAULT_TAG, CollapsibleButtonProps>(
  (props, forwardedRef) => {
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
  }
);

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'Collapsible.Content';
const CONTENT_DEFAULT_TAG = 'div';

type CollapsibleContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type CollapsibleContentOwnProps = {};
type CollapsibleContentProps = CollapsibleContentOwnProps & CollapsibleContentDOMProps;

const CollapsibleContent = forwardRef<typeof CONTENT_DEFAULT_TAG, CollapsibleContentProps>(
  (props, forwardedRef) => {
    const { as: Comp = CONTENT_DEFAULT_TAG, id: idProp, children, ...contentProps } = props;
    const { setContentId, isOpen } = useCollapsibleContext(CONTENT_NAME);
    const generatedId = `collapsible-${useId()}`;
    const id = idProp || generatedId;

    React.useEffect(() => {
      setContentId(id);
    }, [id, setContentId]);

    return (
      <Comp
        {...getPartDataAttrObj(CONTENT_NAME)}
        ref={forwardedRef}
        {...contentProps}
        id={id}
        hidden={!isOpen}
      >
        {isOpen && children}
      </Comp>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible';
const COLLAPSIBLE_DEFAULT_TAG = 'div';

type CollapsibleDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof COLLAPSIBLE_DEFAULT_TAG>,
  'onToggle'
>;
type CollapsibleOwnProps = {
  defaultIsOpen?: boolean;
  isOpen?: boolean;
  disabled?: boolean;
  onToggle?(isOpen?: boolean): void;
};
type CollapsibleProps = CollapsibleDOMProps & CollapsibleOwnProps;

interface CollapsibleStaticProps {
  Button: typeof CollapsibleButton;
  Content: typeof CollapsibleContent;
}

const Collapsible = forwardRef<
  typeof COLLAPSIBLE_DEFAULT_TAG,
  CollapsibleProps,
  CollapsibleStaticProps
>((props, forwardedRef) => {
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

  const [isOpen, setIsOpen] = useControlledState({
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
});

function getState(isOpen?: boolean) {
  return isOpen ? 'open' : 'closed';
}

Collapsible.Button = CollapsibleButton;
Collapsible.Content = CollapsibleContent;

Collapsible.displayName = COLLAPSIBLE_NAME;
Collapsible.Button.displayName = BUTTON_NAME;
Collapsible.Content.displayName = CONTENT_NAME;

export { Collapsible };
export type { CollapsibleProps, CollapsibleButtonProps, CollapsibleContentProps };
