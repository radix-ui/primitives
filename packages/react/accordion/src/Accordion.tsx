import React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  useComposedRefs,
  useControlledState,
  useId,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { Collapsible, CollapsibleButton, CollapsibleContent } from '@interop-ui/react-collapsible';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type AccordionContextValue = {
  buttonNodesRef: React.MutableRefObject<Set<HTMLElement | null>>;
  value?: string;
  isDisabled?: boolean;
  setValue(value: string): void;
};

const [AccordionContext, useAccordionContext] = createContext<AccordionContextValue>(
  'AccordionContext',
  'Accordion'
);

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'AccordionItem';

type AccordionItemOwnProps = { value: string };
type AccordionItemContextValue = { isOpen?: boolean; buttonId: string };

const [AccordionItemContext, useAccordionItemContext] = createContext<AccordionItemContextValue>(
  'AccordionItemContext',
  ITEM_NAME
);

const AccordionItem = forwardRefWithAs<typeof Collapsible, AccordionItemOwnProps>(
  (props, forwardedRef) => {
    const {
      value,
      isOpen: isOpenProp,
      defaultIsOpen,
      children,
      onToggle,
      ...accordionItemProps
    } = props;
    const accordionContext = useAccordionContext(ITEM_NAME);
    const generatedButtonId = `accordion-button-${useId()}`;
    const buttonId = props.id || generatedButtonId;
    const isOpen = (value && value === accordionContext.value) || false;
    const disabled = accordionContext.isDisabled ?? props.disabled;

    const itemContext: AccordionItemContextValue = React.useMemo(() => ({ isOpen, buttonId }), [
      isOpen,
      buttonId,
    ]);

    return (
      <Collapsible
        {...accordionItemProps}
        {...getPartDataAttrObj(ITEM_NAME)}
        ref={forwardedRef}
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={disabled || undefined}
        disabled={disabled}
        isOpen={isOpen}
        onToggle={() => accordionContext.setValue(value)}
      >
        <AccordionItemContext.Provider value={itemContext}>
          {children}
        </AccordionItemContext.Provider>
      </Collapsible>
    );
  }
);

AccordionItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_NAME = 'AccordionHeader';
const HEADER_DEFAULT_TAG = 'h3';

type AccordionHeaderOwnProps = {};

const AccordionHeader = forwardRefWithAs<typeof HEADER_DEFAULT_TAG, AccordionHeaderOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = HEADER_DEFAULT_TAG, ...headerProps } = props;
    return <Comp ref={forwardedRef} {...headerProps} {...getPartDataAttrObj(HEADER_NAME)} />;
  }
);

AccordionHeader.displayName = HEADER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'AccordionButton';

type AccordionButtonOwnProps = {};

const AccordionButton = forwardRefWithAs<typeof CollapsibleButton, AccordionButtonOwnProps>(
  (props, forwardedRef) => {
    const { ...buttonProps } = props;
    const { buttonNodesRef } = useAccordionContext(BUTTON_NAME);
    const itemContext = useAccordionItemContext(BUTTON_NAME);

    const ref = React.useRef<React.ElementRef<typeof CollapsibleButton>>(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);

    React.useEffect(() => {
      const buttonNodes = buttonNodesRef.current;
      const buttonNode = ref.current;

      if (buttonNode) {
        buttonNodes.add(buttonNode);
        return () => {
          buttonNodes.delete(buttonNode);
        };
      }
      return;
    }, [buttonNodesRef]);

    return (
      <CollapsibleButton
        {...buttonProps}
        {...getPartDataAttrObj(BUTTON_NAME)}
        ref={composedRefs}
        aria-disabled={itemContext.isOpen || undefined}
        id={itemContext.buttonId}
      />
    );
  }
);

AccordionButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionPanel
 * -----------------------------------------------------------------------------------------------*/

const PANEL_NAME = 'AccordionPanel';

type AccordionPanelOwnProps = {};

const AccordionPanel = forwardRefWithAs<typeof CollapsibleContent, AccordionPanelOwnProps>(
  (props, forwardedRef) => {
    const itemContext = useAccordionItemContext(PANEL_NAME);
    return (
      <CollapsibleContent
        {...props}
        {...getPartDataAttrObj(PANEL_NAME)}
        ref={forwardedRef}
        role="region"
        aria-labelledby={itemContext.buttonId}
      />
    );
  }
);

AccordionPanel.displayName = PANEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion';
const ACCORDION_DEFAULT_TAG = 'div';
const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp'];

type AccordionOwnProps = {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?(value: string): void;
};

const Accordion = forwardRefWithAs<typeof ACCORDION_DEFAULT_TAG, AccordionOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = ACCORDION_DEFAULT_TAG,
      value: valueProp,
      defaultValue,
      children,
      disabled: isDisabled,
      onChange = () => {},
      ...accordionProps
    } = props;

    const buttonNodesRef = React.useRef<Set<React.ElementRef<typeof AccordionButton>>>(new Set());
    const accordionRef = React.useRef<React.ElementRef<typeof Accordion>>(null);
    const composedRefs = useComposedRefs(accordionRef, forwardedRef);

    const [value, setValue] = useControlledState({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: (value) => value && onChange(value),
    });

    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      const target = event.target as HTMLElement;
      const isAccordionKey = ACCORDION_KEYS.includes(event.key);

      if (!isAccordionKey || !isButton(target)) {
        return;
      }

      const buttonNodes = [...buttonNodesRef.current].filter((node) => !(node && node.disabled));
      const buttonCount = buttonNodes.length;
      const buttonIndex = buttonNodes.indexOf(target);

      if (buttonIndex === -1) return;

      // Prevents page scroll while user is navigating
      event.preventDefault();

      let nextIndex = buttonIndex;
      switch (event.key) {
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = buttonCount - 1;
          break;
        case 'ArrowDown':
          nextIndex = buttonIndex + 1;
          break;
        case 'ArrowUp':
          nextIndex = buttonIndex - 1;
          if (nextIndex < 0) {
            nextIndex = buttonCount - 1;
          }
          break;
      }

      const clampedIndex = nextIndex % buttonCount;
      buttonNodes[clampedIndex]?.focus();
    });

    const context: AccordionContextValue = React.useMemo(
      () => ({
        isDisabled,
        buttonNodesRef,
        value,
        setValue,
      }),
      [isDisabled, value, setValue]
    );

    return (
      <Comp
        {...accordionProps}
        {...getPartDataAttrObj(ACCORDION_NAME)}
        ref={composedRefs}
        onKeyDown={isDisabled ? undefined : handleKeyDown}
      >
        <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>
      </Comp>
    );
  }
);

Accordion.displayName = ACCORDION_NAME;

/* -----------------------------------------------------------------------------------------------*/

function isButton(element: HTMLElement): element is HTMLButtonElement {
  return element instanceof HTMLButtonElement;
}

const Root = Accordion;
const Item = AccordionItem;
const Header = AccordionHeader;
const Button = AccordionButton;
const Panel = AccordionPanel;

export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
  Root,
  Item,
  Header,
  Button,
  Panel,
};
