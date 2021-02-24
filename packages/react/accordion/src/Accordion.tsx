import React from 'react';
import { getSelector } from '@radix-ui/utils';
import {
  composeEventHandlers,
  createContextObj,
  useComposedRefs,
  useControlledState,
} from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { Collapsible, CollapsibleButton, CollapsibleContent } from '@radix-ui/react-collapsible';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion';
const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp'];

type AccordionContextValue = {
  buttonNodesRef: React.MutableRefObject<Set<HTMLElement | null>>;
  value?: string;
  disabled?: boolean;
  onValueChange(value: string): void;
};

const [AccordionProvider, useAccordionContext] = createContextObj<AccordionContextValue>(
  ACCORDION_NAME
);

type AccordionOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
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
  }
>;

type AccordionPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  AccordionOwnProps
>;

/**
 * `Accordion` is the root component.
 */
const Accordion = React.forwardRef((props, forwardedRef) => {
  const {
    selector = getSelector(ACCORDION_NAME),
    value: valueProp,
    defaultValue,
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

  return (
    <AccordionProvider
      disabled={disabled}
      buttonNodesRef={buttonNodesRef}
      value={value}
      onValueChange={setValue}
    >
      <Primitive
        {...accordionProps}
        selector={selector}
        ref={composedRefs}
        onKeyDown={disabled ? undefined : handleKeyDown}
      />
    </AccordionProvider>
  );
}) as AccordionPrimitive;

Accordion.displayName = ACCORDION_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'AccordionItem';

type AccordionItemOwnProps = Merge<
  Omit<Polymorphic.OwnProps<typeof Collapsible>, 'open' | 'defaultOpen' | 'onOpenChange'>,
  {
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
  }
>;

type AccordionItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Collapsible>,
  AccordionItemOwnProps
>;

type AccordionItemContextValue = { open?: boolean; disabled?: boolean; buttonId: string };

const [
  AccordionItemProvider,
  useAccordionItemContext,
] = createContextObj<AccordionItemContextValue>(ITEM_NAME);

/**
 * `AccordionItem` contains all of the parts of a collapsible section inside of an `Accordion`.
 */
const AccordionItem = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(ITEM_NAME), value, ...accordionItemProps } = props;
  const accordionContext = useAccordionContext(ITEM_NAME);
  const buttonId = useId();
  const open = (value && value === accordionContext.value) || false;
  const disabled = accordionContext.disabled || props.disabled;

  return (
    <AccordionItemProvider open={open} disabled={disabled} buttonId={buttonId}>
      <Collapsible
        {...accordionItemProps}
        selector={selector}
        ref={forwardedRef}
        data-state={open ? 'open' : 'closed'}
        disabled={disabled}
        open={open}
        onOpenChange={() => accordionContext.onValueChange(value)}
      />
    </AccordionItemProvider>
  );
}) as AccordionItemPrimitive;

AccordionItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_NAME = 'AccordionHeader';
const HEADER_DEFAULT_TAG = 'h3';

type AccordionHeaderOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type AccordionHeaderPrimitive = Polymorphic.ForwardRefComponent<
  typeof HEADER_DEFAULT_TAG,
  AccordionHeaderOwnProps
>;

/**
 * `AccordionHeader` contains the content for the parts of an `AccordionItem` that will be visible
 * whether or not its content is collapsed.
 */
const AccordionHeader = React.forwardRef((props, forwardedRef) => {
  const { as = HEADER_DEFAULT_TAG, selector = getSelector(HEADER_NAME), ...headerProps } = props;
  const itemContext = useAccordionItemContext(BUTTON_NAME);
  return (
    <Primitive
      data-state={getState(itemContext.open)}
      data-disabled={itemContext.disabled ? '' : undefined}
      {...headerProps}
      as={as}
      selector={selector}
      ref={forwardedRef}
    />
  );
}) as AccordionHeaderPrimitive;

AccordionHeader.displayName = HEADER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'AccordionButton';

type AccordionButtonOwnProps = Polymorphic.OwnProps<typeof CollapsibleButton>;
type AccordionButtonPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof CollapsibleButton>,
  AccordionButtonOwnProps
>;

/**
 * `AccordionButton` is the trigger that toggles the collapsed state of an `AccordionItem`. It
 * should always be nested inside of an `AccordionHeader`.
 */
const AccordionButton = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(BUTTON_NAME), ...buttonProps } = props;
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
      aria-disabled={itemContext.open || undefined}
      id={itemContext.buttonId}
      {...buttonProps}
      selector={selector}
      ref={composedRefs}
    />
  );
}) as AccordionButtonPrimitive;

AccordionButton.displayName = BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionPanel
 * -----------------------------------------------------------------------------------------------*/

const PANEL_NAME = 'AccordionPanel';

type AccordionPanelOwnProps = Polymorphic.OwnProps<typeof CollapsibleContent>;
type AccordionPanelPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof CollapsibleContent>,
  AccordionPanelOwnProps
>;
/**
 * `AccordionPanel` contains the collapsible content for an `AccordionItem`.
 */
const AccordionPanel = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(PANEL_NAME), ...panelProps } = props;
  const itemContext = useAccordionItemContext(PANEL_NAME);
  return (
    <CollapsibleContent
      role="region"
      aria-labelledby={itemContext.buttonId}
      {...panelProps}
      selector={selector}
      ref={forwardedRef}
    />
  );
}) as AccordionPanelPrimitive;

AccordionPanel.displayName = PANEL_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(open?: boolean) {
  return open ? 'open' : 'closed';
}

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
