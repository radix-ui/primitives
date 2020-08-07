import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import {
  createContext,
  forwardRef,
  useId,
  composeEventHandlers,
  useControlledState,
  PrimitiveStyles,
} from '@interop-ui/react-utils';

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
    let { as: Comp = BUTTON_DEFAULT_TAG, onClick, ...buttonProps } = props;
    let context = useCollapsibleContext(BUTTON_NAME);

    return (
      <Comp
        {...interopDataAttrObj(BUTTON_NAME)}
        ref={forwardedRef}
        aria-controls={context.contentId}
        aria-expanded={context.isOpen || false}
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
        {...interopDataAttrObj(CONTENT_NAME)}
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
  let {
    as: Comp = COLLAPSIBLE_DEFAULT_TAG,
    id: idProp,
    children,
    isOpen: isOpenProp,
    defaultIsOpen,
    disabled: isDisabled,
    onToggle,
    ...collapsibleProps
  } = props;

  let [isOpen, setIsOpen] = useControlledState({
    prop: isOpenProp,
    defaultProp: defaultIsOpen,
    onChange: onToggle,
  });
  let [contentId, setContentId] = React.useState<string>();
  let context = React.useMemo(
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
    <Comp {...interopDataAttrObj(COLLAPSIBLE_NAME)} {...collapsibleProps} ref={forwardedRef}>
      <CollapsibleContext.Provider value={context}>{children}</CollapsibleContext.Provider>
    </Comp>
  );
});

Collapsible.Button = CollapsibleButton;
Collapsible.Content = CollapsibleContent;

Collapsible.displayName = COLLAPSIBLE_NAME;
Collapsible.Button.displayName = BUTTON_NAME;
Collapsible.Content.displayName = CONTENT_NAME;

const styles: PrimitiveStyles = {
  [interopSelector(COLLAPSIBLE_NAME)]: {
    ...cssReset(COLLAPSIBLE_DEFAULT_TAG),
  },
  [interopSelector(BUTTON_NAME)]: {
    ...cssReset(BUTTON_DEFAULT_TAG),
    display: 'block',
    width: '100%',
    textAlign: 'inherit',
    userSelect: 'none',

    '&:disabled': {
      pointerEvents: 'none',
    },
  },
  [interopSelector(CONTENT_NAME)]: {
    ...cssReset(CONTENT_DEFAULT_TAG),
  },
};

export type { CollapsibleProps, CollapsibleButtonProps, CollapsibleContentProps };
export { Collapsible, styles };
