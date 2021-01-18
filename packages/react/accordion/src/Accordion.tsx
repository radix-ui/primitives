import React from 'react';
import { getSelector } from '@radix-ui/utils';
import {
  composeEventHandlers,
  createContext,
  useComposedRefs,
  useControlledState,
  useId,
} from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';
import { Collapsible, CollapsibleButton, CollapsibleContent } from '@radix-ui/react-collapsible';

import type { OwnProps } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type AccordionContextValue = {
  buttonNodesRef: React.MutableRefObject<Set<HTMLElement | null>>;
  value?: string;
  disabled?: boolean;
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

type AccordionItemOwnProps = {
  /**
   * Whether or not an accordion item is disabled from user interaction.
   *
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * A string value for the accordion item. All items within an accordion should use a unique value.
   */
  value: string;
  open: never;
  defaultOpen: never;
  onOpenChange: never;
};
type AccordionItemContextValue = { open?: boolean; buttonId: string };

const [AccordionItemContext, useAccordionItemContext] = createContext<AccordionItemContextValue>(
  'AccordionItemContext',
  ITEM_NAME
);

/**
 * `AccordionItem` contains all of the parts of a collapsible section inside of an `Accordion`.
 */
const AccordionItem = forwardRefWithAs<typeof Collapsible, AccordionItemOwnProps>(
  (props, forwardedRef) => {
    const { value, children, ...accordionItemProps } = props;
    const accordionContext = useAccordionContext(ITEM_NAME);
    const generatedButtonId = `accordion-button-${useId()}`;
    const buttonId = props.id || generatedButtonId;
    const open = (value && value === accordionContext.value) || false;
    const disabled = accordionContext.disabled || props.disabled;

    const itemContext: AccordionItemContextValue = React.useMemo(() => ({ open, buttonId }), [
      open,
      buttonId,
    ]);

    return (
      <Collapsible
        selector={getSelector(ITEM_NAME)}
        {...accordionItemProps}
        ref={forwardedRef}
        data-state={open ? 'open' : 'closed'}
        data-disabled={disabled || undefined}
        disabled={disabled}
        open={open}
        onOpenChange={() => accordionContext.setValue(value)}
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

/**
 * `AccordionHeader` contains the content for the parts of an `AccordionItem` that will be visible
 * whether or not its content is collapsed.
 */
const AccordionHeader = forwardRefWithAs<typeof HEADER_DEFAULT_TAG, OwnProps<typeof Primitive>>(
  (props, forwardedRef) => (
    <Primitive
      as={HEADER_DEFAULT_TAG}
      selector={getSelector(HEADER_NAME)}
      {...props}
      ref={forwardedRef}
    />
  )
);

AccordionHeader.displayName = HEADER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'AccordionButton';

/**
 * `AccordionButton` is the trigger that toggles the collapsed state of an `AccordionItem`. It
 * should always be nested inside of an `AccordionHeader`.
 */
const AccordionButton = forwardRefWithAs<typeof CollapsibleButton>((props, forwardedRef) => {
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
      selector={getSelector(BUTTON_NAME)}
      {...props}
      ref={composedRefs}
      aria-disabled={itemContext.open || undefined}
      id={itemContext.buttonId}
    />
  );
});

AccordionButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionPanel
 * -----------------------------------------------------------------------------------------------*/

const PANEL_NAME = 'AccordionPanel';

/**
 * `AccordionPanel` contains the collapsible content for an `AccordionItem`.
 */
const AccordionPanel = forwardRefWithAs<typeof CollapsibleContent>((props, forwardedRef) => {
  const itemContext = useAccordionItemContext(PANEL_NAME);
  return (
    <CollapsibleContent
      selector={getSelector(PANEL_NAME)}
      {...props}
      ref={forwardedRef}
      role="region"
      aria-labelledby={itemContext.buttonId}
    />
  );
});

AccordionPanel.displayName = PANEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion';
const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp'];

type AccordionOwnProps = {
  /**
   * The controlled stateful value of the accordion item whose panel is expanded.
   */
  value?: string;
  /**
   * The value of the item whose panel is expanded when the accordion is initially rendered. Use
   * `defaultValue` if you do not need to control the state of an accordion.
   */
  defaultValue?: string;
  /**
   * Whether or not an accordion is disabled from user interaction.
   *
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * The callback that fires when the state of the accordion changes.
   */
  onValueChange?(value: string): void;
};

/**
 * `Accordion` is the root component.
 */
const Accordion = forwardRefWithAs<typeof Primitive, AccordionOwnProps>((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    children,
    disabled,
    onValueChange = () => {},
    ...accordionProps
  } = props;

  const buttonNodesRef = React.useRef<Set<React.ElementRef<typeof AccordionButton>>>(new Set());
  const accordionRef = React.useRef<React.ElementRef<typeof Accordion>>(null);
  const composedRefs = useComposedRefs(accordionRef, forwardedRef);

  const [value, setValue] = useControlledState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: (value) => value && onValueChange(value),
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
      disabled,
      buttonNodesRef,
      value,
      setValue,
    }),
    [disabled, value, setValue]
  );

  return (
    <Primitive
      selector={getSelector(ACCORDION_NAME)}
      {...accordionProps}
      ref={composedRefs}
      onKeyDown={disabled ? undefined : handleKeyDown}
    >
      <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>
    </Primitive>
  );
});

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
  //
  Root,
  Item,
  Header,
  Button,
  Panel,
};
