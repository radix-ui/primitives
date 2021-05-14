import React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion';
const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp'];

type AccordionOwnProps =
  | ({ type: 'single' } & Polymorphic.OwnProps<typeof AccordionSingle>)
  | ({ type: 'multiple' } & Polymorphic.OwnProps<typeof AccordionMultiple>);

type AccordionPrimitive = Polymorphic.ForwardRefComponent<
  | Polymorphic.IntrinsicElement<typeof AccordionSingle>
  | Polymorphic.IntrinsicElement<typeof AccordionMultiple>,
  AccordionOwnProps
>;

const Accordion = React.forwardRef((props, forwardedRef) => {
  const { type, ...accordionProps } = props;

  if (type === 'single') {
    const singleProps = accordionProps as React.ComponentProps<typeof AccordionSingle>;
    return <AccordionSingle {...singleProps} ref={forwardedRef} />;
  }

  if (type === 'multiple') {
    const multipleProps = accordionProps as React.ComponentProps<typeof AccordionMultiple>;
    return <AccordionMultiple {...multipleProps} ref={forwardedRef} />;
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

const AccordionCollapsibleContext = React.createContext(false);

type AccordionSingleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof AccordionImpl>,
  {
    /**
     * The controlled stateful value of the accordion item whose content is expanded.
     */
    value?: string;
    /**
     * The value of the item whose content is expanded when the accordion is initially rendered. Use
     * `defaultValue` if you do not need to control the state of an accordion.
     */
    defaultValue?: string;
    /**
     * The callback that fires when the state of the accordion changes.
     */
    onValueChange?(value: string): void;
    /**
     * Whether an accordion item can be collapsed after it has been opened.
     * @default false
     */
    collapsible?: boolean;
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
    collapsible = false,
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
      onItemClose={() => collapsible && setValue('')}
    >
      <AccordionCollapsibleContext.Provider value={collapsible}>
        <AccordionImpl {...accordionSingleProps} ref={forwardedRef} />
      </AccordionCollapsibleContext.Provider>
    </AccordionValueProvider>
  );
}) as AccordionSinglePrimitive;

type AccordionMultipleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof AccordionImpl>,
  {
    /**
     * The controlled stateful value of the accordion items whose contents are expanded.
     */
    value?: string[];
    /**
     * The value of the items whose contents are expanded when the accordion is initially rendered. Use
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
      <AccordionCollapsibleContext.Provider value={true}>
        <AccordionImpl {...accordionMultipleProps} ref={forwardedRef} />
      </AccordionCollapsibleContext.Provider>
    </AccordionValueProvider>
  );
}) as AccordionMultiplePrimitive;

/* -----------------------------------------------------------------------------------------------*/

type AccordionImplContextValue = {
  triggerNodesRef: React.MutableRefObject<Set<HTMLElement | null>>;
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
  const triggerNodesRef = React.useRef<Set<React.ElementRef<typeof AccordionTrigger>>>(new Set());
  const accordionRef = React.useRef<React.ElementRef<typeof AccordionImpl>>(null);
  const composedRefs = useComposedRefs(accordionRef, forwardedRef);

  const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
    const target = event.target as HTMLElement;
    const isAccordionKey = ACCORDION_KEYS.includes(event.key);

    if (!isAccordionKey || !isButton(target)) {
      return;
    }

    const triggerNodes = [...triggerNodesRef.current].filter((node) => !node?.disabled);
    const triggerCount = triggerNodes.length;
    const triggerIndex = triggerNodes.indexOf(target);

    if (triggerIndex === -1) return;

    // Prevents page scroll while user is navigating
    event.preventDefault();

    let nextIndex = triggerIndex;
    switch (event.key) {
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = triggerCount - 1;
        break;
      case 'ArrowDown':
        nextIndex = triggerIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = triggerIndex - 1;
        if (nextIndex < 0) {
          nextIndex = triggerCount - 1;
        }
        break;
    }

    const clampedIndex = nextIndex % triggerCount;
    triggerNodes[clampedIndex]?.focus();
  });

  return (
    <AccordionImplProvider triggerNodesRef={triggerNodesRef} disabled={disabled}>
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
  Omit<
    Polymorphic.OwnProps<typeof CollapsiblePrimitive.Root>,
    'open' | 'defaultOpen' | 'onOpenChange'
  >,
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
  Polymorphic.IntrinsicElement<typeof CollapsiblePrimitive.Root>,
  AccordionItemOwnProps
>;

type AccordionItemContextValue = { open?: boolean; disabled?: boolean; triggerId: string };

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
  const triggerId = useId();
  const open = (value && valueContext.value.includes(value)) || false;
  const disabled = accordionContext.disabled || props.disabled;

  return (
    <AccordionItemProvider open={open} disabled={disabled} triggerId={triggerId}>
      <CollapsiblePrimitive.Root
        data-state={open ? 'open' : 'closed'}
        {...accordionItemProps}
        ref={forwardedRef}
        disabled={disabled}
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
  const itemContext = useAccordionItemContext(HEADER_NAME);
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
 * AccordionTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'AccordionTrigger';

type AccordionTriggerOwnProps = Polymorphic.OwnProps<typeof CollapsiblePrimitive.Trigger>;
type AccordionTriggerPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof CollapsiblePrimitive.Trigger>,
  AccordionTriggerOwnProps
>;

/**
 * `AccordionTrigger` is the trigger that toggles the collapsed state of an `AccordionItem`. It
 * should always be nested inside of an `AccordionHeader`.
 */
const AccordionTrigger = React.forwardRef((props, forwardedRef) => {
  const { triggerNodesRef } = useAccordionContext(TRIGGER_NAME);
  const itemContext = useAccordionItemContext(TRIGGER_NAME);
  const collapsible = React.useContext(AccordionCollapsibleContext);

  const ref = React.useRef<React.ElementRef<typeof CollapsiblePrimitive.Trigger>>(null);
  const composedRefs = useComposedRefs(ref, forwardedRef);

  React.useEffect(() => {
    const triggerNodes = triggerNodesRef.current;
    const triggerNode = ref.current;

    if (triggerNode) {
      triggerNodes.add(triggerNode);
      return () => {
        triggerNodes.delete(triggerNode);
      };
    }
    return;
  }, [triggerNodesRef]);

  return (
    <CollapsiblePrimitive.Trigger
      aria-disabled={(itemContext.open && !collapsible) || undefined}
      id={itemContext.triggerId}
      {...props}
      ref={composedRefs}
    />
  );
}) as AccordionTriggerPrimitive;

AccordionTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AccordionContent';

type AccordionContentOwnProps = Polymorphic.OwnProps<typeof CollapsiblePrimitive.Content>;
type AccordionContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof CollapsiblePrimitive.Content>,
  AccordionContentOwnProps
>;
/**
 * `AccordionContent` contains the collapsible content for an `AccordionItem`.
 */
const AccordionContent = React.forwardRef((props, forwardedRef) => {
  const itemContext = useAccordionItemContext(CONTENT_NAME);
  return (
    <CollapsiblePrimitive.Content
      role="region"
      aria-labelledby={itemContext.triggerId}
      {...props}
      style={{
        ['--radix-accordion-content-height' as any]: 'var(--radix-collapsible-content-height)',
        ...props.style,
      }}
      ref={forwardedRef}
    />
  );
}) as AccordionContentPrimitive;

AccordionContent.displayName = CONTENT_NAME;

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
const Trigger = AccordionTrigger;
const Content = AccordionContent;

export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  //
  Root,
  Item,
  Header,
  Trigger,
  Content,
};
export type {
  AccordionPrimitive,
  AccordionItemPrimitive,
  AccordionHeaderPrimitive,
  AccordionTriggerPrimitive,
  AccordionContentPrimitive,
};
