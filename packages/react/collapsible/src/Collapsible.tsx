import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import {
  forwardRef,
  useId,
  composeEventHandlers,
  useControlledState,
  ForwardRefExoticComponentWithAs,
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

const CollapsibleContext = React.createContext<CollapsibleContextValue>(null as any);

function useCollapsibleContext(componentName: string) {
  let context = React.useContext(CollapsibleContext);
  if (context === null) {
    throw new Error(`\`${componentName}\` must be used within \`Collapsible\``);
  }
  return context;
}

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
    let context = useCollapsibleContext('CollapsibleButton');

    return (
      <Comp
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
    const { setContentId, isOpen } = useCollapsibleContext('CollapsibleContent');
    const generatedId = `collapsible-${useId()}`;
    const id = idProp || generatedId;

    React.useEffect(() => {
      setContentId(id);
    }, [id, setContentId]);

    return (
      <Comp ref={forwardedRef} {...contentProps} id={id} hidden={!isOpen}>
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

interface ICollapsible
  extends ForwardRefExoticComponentWithAs<typeof COLLAPSIBLE_DEFAULT_TAG, CollapsibleProps> {
  Button: typeof CollapsibleButton;
  Content: typeof CollapsibleContent;
}

const Collapsible = forwardRef<typeof COLLAPSIBLE_DEFAULT_TAG, CollapsibleProps>(
  (props, forwardedRef) => {
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
        <Comp {...collapsibleProps} ref={forwardedRef}>
          {children}
        </Comp>
      </CollapsibleContext.Provider>
    );
  }
) as ICollapsible;

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
