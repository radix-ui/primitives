import React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  forwardRef,
  useComposedRefs,
  useControlledState,
  useId,
} from '@interop-ui/react-utils';
import { Collapsible } from '@interop-ui/react-collapsible';

import type {
  CollapsibleProps,
  CollapsibleButtonProps,
  CollapsibleContentProps,
} from '@interop-ui/react-collapsible';
import type { ElementByTag } from '@interop-ui/react-utils';

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

const ITEM_NAME = 'Accordion.Item';
const ITEM_DEFAULT_TAG = 'div';

type AccordionItemDOMProps = React.ComponentPropsWithoutRef<typeof ITEM_DEFAULT_TAG>;
type AccordionItemOwnProps = {
  value: string;
};
type AccordionItemProps = CollapsibleProps & AccordionItemDOMProps & AccordionItemOwnProps;

type AccordionItemContextValue = {
  isOpen?: boolean;
  buttonId: string;
};

const [AccordionItemContext, useAccordionItemContext] = createContext<AccordionItemContextValue>(
  'AccordionItemContext',
  ITEM_NAME
);

const AccordionItem = forwardRef<typeof ITEM_DEFAULT_TAG, AccordionItemProps>(
  function AccordionItem(props, forwardedRef) {
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

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_NAME = 'Accordion.Header';
const HEADER_DEFAULT_TAG = 'h3';

type AccordionHeaderDOMProps = React.ComponentPropsWithoutRef<typeof HEADER_DEFAULT_TAG>;
type AccordionHeaderOwnProps = {};
type AccordionHeaderProps = AccordionHeaderDOMProps & AccordionHeaderOwnProps;

const AccordionHeader = forwardRef<typeof HEADER_DEFAULT_TAG, AccordionHeaderProps>(
  function AccordionHeader(props, forwardedRef) {
    const { as: Comp = HEADER_DEFAULT_TAG, ...headerProps } = props;

    return <Comp ref={forwardedRef} {...headerProps} {...getPartDataAttrObj(HEADER_NAME)} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * AccordionButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'Accordion.Button';
const BUTTON_DEFAULT_TAG = 'button';

type AccordionButtonDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_DEFAULT_TAG>;
type AccordionButtonOwnProps = {};
type AccordionButtonProps = CollapsibleButtonProps &
  AccordionButtonDOMProps &
  AccordionButtonOwnProps;

const AccordionButton = forwardRef<typeof BUTTON_DEFAULT_TAG, AccordionButtonProps>(
  function AccordionButton(props, forwardedRef) {
    const { ...buttonProps } = props;
    const { buttonNodesRef } = useAccordionContext(BUTTON_NAME);
    const itemContext = useAccordionItemContext(BUTTON_NAME);

    const ref = React.useRef<ElementByTag<typeof BUTTON_DEFAULT_TAG> | null>(null);
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
      <Collapsible.Button
        {...buttonProps}
        {...getPartDataAttrObj(BUTTON_NAME)}
        ref={composedRefs}
        aria-disabled={itemContext.isOpen || undefined}
        id={itemContext.buttonId}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AccordionPanel
 * -----------------------------------------------------------------------------------------------*/

const PANEL_NAME = 'Accordion.Panel';
const PANEL_DEFAULT_TAG = 'div';

type AccordionPanelDOMProps = React.ComponentPropsWithoutRef<typeof PANEL_DEFAULT_TAG>;
type AccordionPanelOwnProps = {};
type AccordionPanelProps = CollapsibleContentProps &
  AccordionPanelDOMProps &
  AccordionPanelOwnProps;

const AccordionPanel = forwardRef<typeof PANEL_DEFAULT_TAG, AccordionPanelProps>(
  function AccordionPanel(props, forwardedRef) {
    const itemContext = useAccordionItemContext(PANEL_NAME);
    return (
      <Collapsible.Content
        {...props}
        {...getPartDataAttrObj(PANEL_NAME)}
        ref={forwardedRef}
        role="region"
        aria-labelledby={itemContext.buttonId}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion';
const ACCORDION_DEFAULT_TAG = 'div';

type AccordionDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof ACCORDION_DEFAULT_TAG>,
  'defaultValue' | 'onChange'
>;
type AccordionOwnProps = {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?(value: string): void;
};
type AccordionProps = AccordionDOMProps & AccordionOwnProps;

const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp'];

const Accordion = forwardRef<typeof ACCORDION_DEFAULT_TAG, AccordionProps, AccordionStaticProps>(
  function Accordion(props, forwardedRef) {
    const {
      as: Comp = ACCORDION_DEFAULT_TAG,
      value: valueProp,
      defaultValue,
      children,
      disabled: isDisabled,
      onChange = () => {},
      ...accordionProps
    } = props;

    const buttonNodesRef = React.useRef<Set<ElementByTag<typeof BUTTON_DEFAULT_TAG> | null>>(
      new Set()
    );
    const accordionRef = React.useRef<ElementByTag<typeof ACCORDION_DEFAULT_TAG> | null>(null);
    const composedRefs = useComposedRefs(accordionRef, forwardedRef);

    const [value, setValue] = useControlledState({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: (value) => value && onChange(value),
    });

    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      const target = event.target as HTMLElement;
      if (!ACCORDION_KEYS.includes(event.key) || !isButton(target)) {
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

/* -----------------------------------------------------------------------------------------------*/

function isButton(element: HTMLElement): element is HTMLButtonElement {
  return element instanceof HTMLButtonElement;
}

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Button = AccordionButton;
Accordion.Panel = AccordionPanel;

Accordion.displayName = ACCORDION_NAME;
Accordion.Item.displayName = ITEM_NAME;
Accordion.Header.displayName = HEADER_NAME;
Accordion.Button.displayName = BUTTON_NAME;
Accordion.Panel.displayName = PANEL_NAME;

interface AccordionStaticProps {
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Button: typeof AccordionButton;
  Panel: typeof AccordionPanel;
}

export { Accordion };
export type {
  AccordionProps,
  AccordionButtonProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionPanelProps,
};
