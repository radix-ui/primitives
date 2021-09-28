import React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { useId } from '@radix-ui/react-id';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion';
const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp'];

type AccordionElement = AccordionImplMultipleElement | AccordionImplSingleElement;
interface AccordionSingleProps extends AccordionImplSingleProps {
  type: 'single';
}
interface AccordionMultipleProps extends AccordionImplMultipleProps {
  type: 'multiple';
}

const Accordion = React.forwardRef<AccordionElement, AccordionSingleProps | AccordionMultipleProps>(
  (props, forwardedRef) => {
    const { type, ...accordionProps } = props;

    if (type === 'single') {
      const singleProps = accordionProps as AccordionImplSingleProps;
      return <AccordionImplSingle {...singleProps} ref={forwardedRef} />;
    }

    if (type === 'multiple') {
      const multipleProps = accordionProps as AccordionImplMultipleProps;
      return <AccordionImplMultiple {...multipleProps} ref={forwardedRef} />;
    }

    throw new Error(`Missing prop \`type\` expected on \`${ACCORDION_NAME}\``);
  }
);

Accordion.displayName = ACCORDION_NAME;

/* -----------------------------------------------------------------------------------------------*/

type AccordionValueContextValue = {
  value: string[];
  onItemOpen(value: string): void;
  onItemClose(value: string): void;
};

const [AccordionValueProvider, useAccordionValueContext] =
  createContext<AccordionValueContextValue>(ACCORDION_NAME);

const AccordionCollapsibleContext = React.createContext(false);

type AccordionImplSingleElement = AccordionImplElement;
interface AccordionImplSingleProps extends AccordionImplProps {
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

const AccordionImplSingle = React.forwardRef<AccordionImplSingleElement, AccordionImplSingleProps>(
  (props, forwardedRef) => {
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
        onItemClose={React.useCallback(() => collapsible && setValue(''), [collapsible, setValue])}
      >
        <AccordionCollapsibleContext.Provider value={collapsible}>
          <AccordionImpl {...accordionSingleProps} ref={forwardedRef} />
        </AccordionCollapsibleContext.Provider>
      </AccordionValueProvider>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

type AccordionImplMultipleElement = AccordionImplElement;
interface AccordionImplMultipleProps extends AccordionImplProps {
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

const AccordionImplMultiple = React.forwardRef<
  AccordionImplMultipleElement,
  AccordionImplMultipleProps
>((props, forwardedRef) => {
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
});

/* -----------------------------------------------------------------------------------------------*/

type AccordionImplContextValue = {
  triggerNodesRef: React.MutableRefObject<Set<HTMLElement | null>>;
  disabled?: boolean;
};

const [AccordionImplProvider, useAccordionContext] =
  createContext<AccordionImplContextValue>(ACCORDION_NAME);

type AccordionImplElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface AccordionImplProps extends PrimitiveDivProps {
  /**
   * Whether or not an accordion is disabled from user interaction.
   *
   * @defaultValue false
   */
  disabled?: boolean;
}

const AccordionImpl = React.forwardRef<AccordionImplElement, AccordionImplProps>(
  (props, forwardedRef) => {
    const { disabled, ...accordionProps } = props;
    const triggerNodesRef = React.useRef<Set<AccordionTriggerElement>>(new Set());
    const accordionRef = React.useRef<AccordionImplElement>(null);
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
        <Primitive.div
          {...accordionProps}
          ref={composedRefs}
          onKeyDown={disabled ? undefined : handleKeyDown}
        />
      </AccordionImplProvider>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'AccordionItem';

type AccordionItemContextValue = { open?: boolean; disabled?: boolean; triggerId: string };

const [AccordionItemProvider, useAccordionItemContext] =
  createContext<AccordionItemContextValue>(ITEM_NAME);

type AccordionItemElement = React.ElementRef<typeof CollapsiblePrimitive.Root>;
type CollapsibleProps = Radix.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;
interface AccordionItemProps
  extends Omit<CollapsibleProps, 'open' | 'defaultOpen' | 'onOpenChange'> {
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

/**
 * `AccordionItem` contains all of the parts of a collapsible section inside of an `Accordion`.
 */
const AccordionItem = React.forwardRef<AccordionItemElement, AccordionItemProps>(
  (props, forwardedRef) => {
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
  }
);

AccordionItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_NAME = 'AccordionHeader';

type AccordionHeaderElement = React.ElementRef<typeof Primitive.h3>;
type PrimitiveHeading3Props = Radix.ComponentPropsWithoutRef<typeof Primitive.h3>;
interface AccordionHeaderProps extends PrimitiveHeading3Props {}

/**
 * `AccordionHeader` contains the content for the parts of an `AccordionItem` that will be visible
 * whether or not its content is collapsed.
 */
const AccordionHeader = React.forwardRef<AccordionHeaderElement, AccordionHeaderProps>(
  (props, forwardedRef) => {
    const itemContext = useAccordionItemContext(HEADER_NAME);
    return (
      <Primitive.h3
        data-state={getState(itemContext.open)}
        data-disabled={itemContext.disabled ? '' : undefined}
        {...props}
        ref={forwardedRef}
      />
    );
  }
);

AccordionHeader.displayName = HEADER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'AccordionTrigger';

type AccordionTriggerElement = React.ElementRef<typeof CollapsiblePrimitive.Trigger>;
type CollapsibleTriggerProps = Radix.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>;
interface AccordionTriggerProps extends CollapsibleTriggerProps {}

/**
 * `AccordionTrigger` is the trigger that toggles the collapsed state of an `AccordionItem`. It
 * should always be nested inside of an `AccordionHeader`.
 */
const AccordionTrigger = React.forwardRef<AccordionTriggerElement, AccordionTriggerProps>(
  (props, forwardedRef) => {
    const { triggerNodesRef } = useAccordionContext(TRIGGER_NAME);
    const itemContext = useAccordionItemContext(TRIGGER_NAME);
    const collapsible = React.useContext(AccordionCollapsibleContext);

    const ref = React.useRef<AccordionTriggerElement>(null);
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
  }
);

AccordionTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AccordionContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AccordionContent';

type AccordionContentElement = React.ElementRef<typeof CollapsiblePrimitive.Content>;
type CollapsibleContentProps = Radix.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>;
interface AccordionContentProps extends CollapsibleContentProps {}

/**
 * `AccordionContent` contains the collapsible content for an `AccordionItem`.
 */
const AccordionContent = React.forwardRef<AccordionContentElement, AccordionContentProps>(
  (props, forwardedRef) => {
    const itemContext = useAccordionItemContext(CONTENT_NAME);
    return (
      <CollapsiblePrimitive.Content
        role="region"
        aria-labelledby={itemContext.triggerId}
        {...props}
        style={{
          ['--radix-accordion-content-height' as any]: 'var(--radix-collapsible-content-height)',
          ['--radix-accordion-content-width' as any]: 'var(--radix-collapsible-content-width)',
          ...props.style,
        }}
        ref={forwardedRef}
      />
    );
  }
);

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
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
};
