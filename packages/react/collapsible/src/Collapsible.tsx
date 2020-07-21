import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import {
  createContext,
  forwardRef,
  useId,
  composeEventHandlers,
  useControlledState,
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

const BUTTON_DEFAULT_TAG = 'button';

type CollapsibleButtonDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_DEFAULT_TAG>;
type CollapsibleButtonOwnProps = {};
type CollapsibleButtonProps = CollapsibleButtonDOMProps & CollapsibleButtonOwnProps;

const CollapsibleButton = forwardRef<typeof BUTTON_DEFAULT_TAG, CollapsibleButtonProps>(
  (props, forwardedRef) => {
    let { as: Comp = BUTTON_DEFAULT_TAG, onClick, ...buttonProps } = props;
    let context = useCollapsibleContext('Collapsible.Button');

    return (
      <Comp
        {...interopDataAttrObj('CollapsibleButton')}
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

CollapsibleButton.displayName = 'Collapsible.Button';

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_DEFAULT_TAG = 'div';

type CollapsibleContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type CollapsibleContentOwnProps = {};
type CollapsibleContentProps = CollapsibleContentOwnProps & CollapsibleContentDOMProps;

const CollapsibleContent = forwardRef<typeof CONTENT_DEFAULT_TAG, CollapsibleContentProps>(
  (props, forwardedRef) => {
    const { as: Comp = CONTENT_DEFAULT_TAG, id: idProp, children, ...contentProps } = props;
    const { setContentId, isOpen } = useCollapsibleContext('Collapsible.Content');
    const generatedId = `collapsible-${useId()}`;
    const id = idProp || generatedId;

    React.useEffect(() => {
      setContentId(id);
    }, [id, setContentId]);

    return (
      <Comp
        {...interopDataAttrObj('CollapsibleContent')}
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

CollapsibleContent.displayName = 'Collapsible.Content';

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

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
    <CollapsibleContext.Provider value={context}>
      <Comp {...interopDataAttrObj('Collapsible')} {...collapsibleProps} ref={forwardedRef}>
        {children}
      </Comp>
    </CollapsibleContext.Provider>
  );
});

Collapsible.Button = CollapsibleButton;
Collapsible.Content = CollapsibleContent;

Collapsible.displayName = 'Collapsible';

const styles = {
  collapsible: {
    ...cssReset(COLLAPSIBLE_DEFAULT_TAG),
  },
  button: {
    ...cssReset(BUTTON_DEFAULT_TAG),
    display: 'block',
    width: '100%',
    textAlign: 'inherit',
    userSelect: 'none',
  },
  'collapsible.state.disabled[button]': {
    pointerEvents: 'none',
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
  },
};

export type { CollapsibleProps, CollapsibleButtonProps, CollapsibleContentProps };
export { Collapsible, styles };
