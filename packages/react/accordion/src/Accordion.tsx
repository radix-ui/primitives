import React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { Collapsible, CollapsibleButton, CollapsibleContent } from '@radix-ui/react-collapsible';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion';
const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp'];

type AccordionOwnProps =
  | Polymorphic.OwnProps<typeof AccordionSingle>
  | Polymorphic.OwnProps<typeof AccordionMultiple>;

type AccordionPrimitive = Polymorphic.ForwardRefComponent<
  | Polymorphic.IntrinsicElement<typeof AccordionSingle>
  | Polymorphic.IntrinsicElement<typeof AccordionMultiple>,
  AccordionOwnProps
>;

const Accordion = React.forwardRef((props, forwardedRef) => {
  if (props.type === 'single') {
    return <AccordionSingle {...props} ref={forwardedRef} />;
  }

  if (props.type === 'multiple') {
    return <AccordionMultiple {...props} ref={forwardedRef} />;
  }

  throw new Error(`Missing prop \`type\` expected on \`${ACCORDION_NAME}\``);
}) as AccordionPrimitive;

Accordion.displayName = ACCORDION_NAME;

/* -----------------------------------------------------------------------------------------------*/

type AccordionValueContextValue = {
  value: string[];
  onItemOpen(value: string): void;
  onItemClose(value: string): void;
};

const [
  AccordionValueProvider,
  useAccordionValueContext,
] = createContext<AccordionValueContextValue>(ACCORDION_NAME);

type AccordionSingleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof AccordionImpl>,
  {
    /**
     * Allow only one item to be open at a time.
     */
    type: 'single';
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
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string): void;
  }
>;

type AccordionSinglePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof AccordionImpl>,
  AccordionSingleOwnProps
>;

const AccordionSingle = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...accordionSingleProps
  } = props;

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <AccordionValueProvider
      value={value ? [value] : []}
      onItemOpen={setValue}
      onItemClose={() => setValue(undefined)}
    >
      <AccordionImpl {...accordionSingleProps} ref={forwardedRef} />
    </AccordionValueProvider>
  );
}) as AccordionSinglePrimitive;

type AccordionMultipleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof AccordionImpl>,
  {
    /**
     * Allow mutltiple items to be open at the same time.
     */
    type: 'multiple';
    /**
     * The controlled stateful value of the accordion items whose panels are expanded.
     */
    value?: string[];
    /**
     * The value of the items whose panels are expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string[];
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string[]): void;
  }
>;

type AccordionMultiplePrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof AccordionImpl>,
  AccordionMultipleOwnProps
>;

const AccordionMultiple = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...accordionMultipleProps
  } = props;

  const [value = [], setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const handleItemOpen = React.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );

  const handleItemClose = React.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value) => value !== itemValue)),
    [setValue]
  );

  return (
    <AccordionValueProvider value={value} onItemOpen={handleItemOpen} onItemClose={handleItemClose}>
      <AccordionImpl {...accordionMultipleProps} ref={forwardedRef} />
    </AccordionValueProvider>
  );
}) as AccordionMultiplePrimitive;

/* -----------------------------------------------------------------------------------------------*/

type AccordionImplContextValue = {
  buttonNodesRef: React.MutableRefObject<Set<HTMLElement | null>>;
  disabled?: boolean;
};

const [AccordionImplProvider, useAccordionContext] = createContext<AccordionImplContextValue>(
  ACCORDION_NAME
);

type AccordionImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * Whether or not an accordion is disabled from user interaction.
     *
     * @defaultValue false
     */
    disabled?: boolean;
  }
>;

type AccordionImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  AccordionImplOwnProps
>;

const AccordionImpl = React.forwardRef((props, forwardedRef) => {
  const { disabled, ...accordionProps } = props;
  const buttonNodesRef = React.useRef<Set<React.ElementRef<typeof AccordionButton>>>(new Set());
  const accordionRef = React.useRef<React.ElementRef<typeof AccordionImpl>>(null);
  const composedRefs = useComposedRefs(accordionRef, forwardedRef);

  const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
    const target = event.target as HTMLElement;
    const isAccordionKey = ACCORDION_KEYS.includes(event.key);

    if (!isAccordionKey || !isButton(target)) {
      return;
    }

    const buttonNodes = [...buttonNodesRef.current].filter((node) => !node?.disabled);
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
    <AccordionImplProvider disabled={disabled} buttonNodesRef={buttonNodesRef}>
      <Primitive
        {...accordionProps}
        ref={composedRefs}
        onKeyDown={disabled ? undefined : handleKeyDown}
      />
    </AccordionImplProvider>
  );
}) as AccordionImplPrimitive;

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'AccordionItem';

type AccordionItemOwnProps = Polymorphic.Merge<
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

const [AccordionItemProvider, useAccordionItemContext] = createContext<AccordionItemContextValue>(
  ITEM_NAME
);

/**
 * `AccordionItem` contains all of the parts of a collapsible section inside of an `Accordion`.
 */
const AccordionItem = React.forwardRef((props, forwardedRef) => {
  const { value, ...accordionItemProps } = props;
  const accordionContext = useAccordionContext(ITEM_NAME);
  const valueContext = useAccordionValueContext(ITEM_NAME);
  const buttonId = useId();
  const open = (value && valueContext.value.includes(value)) || false;
  const disabled = accordionContext.disabled || props.disabled;

  return (
    <AccordionItemProvider open={open} disabled={disabled} buttonId={buttonId}>
      <Collapsible
        data-state={open ? 'open' : 'closed'}
        disabled={disabled}
        {...accordionItemProps}
        ref={forwardedRef}
        open={open}
        onOpenChange={(open) => {
          if (open) {
            valueContext.onItemOpen(value);
          } else {
            valueContext.onItemClose(value);
          }
        }}
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
  const { as = HEADER_DEFAULT_TAG, ...headerProps } = props;
  const itemContext = useAccordionItemContext(BUTTON_NAME);
  return (
    <Primitive
      data-state={getState(itemContext.open)}
      data-disabled={itemContext.disabled ? '' : undefined}
      {...headerProps}
      as={as}
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
      {...props}
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
  const itemContext = useAccordionItemContext(PANEL_NAME);
  return (
    <CollapsibleContent
      role="region"
      aria-labelledby={itemContext.buttonId}
      {...props}
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
