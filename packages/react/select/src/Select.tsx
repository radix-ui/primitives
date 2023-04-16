import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { clamp } from '@radix-ui/number';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createCollection } from '@radix-ui/react-collection';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useDirection } from '@radix-ui/react-direction';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { useId } from '@radix-ui/react-id';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import { Portal as PortalPrimitive } from '@radix-ui/react-portal';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { usePrevious } from '@radix-ui/react-use-previous';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { hideOthers } from 'aria-hidden';
import { RemoveScroll } from 'react-remove-scroll';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

type Direction = 'ltr' | 'rtl';

const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown'];
const SELECTION_KEYS = [' ', 'Enter'];

/* -------------------------------------------------------------------------------------------------
 * Select
 * -----------------------------------------------------------------------------------------------*/

const SELECT_NAME = 'Select';

type ItemData = { value: string; disabled: boolean; textValue: string };
const [Collection, useCollection, createCollectionScope] = createCollection<
  SelectItemElement,
  ItemData
>(SELECT_NAME);

type ScopedProps<P> = P & { __scopeSelect?: Scope };
const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createCollectionScope,
  createPopperScope,
]);
const usePopperScope = createPopperScope();

type SelectContextValue = {
  trigger: SelectTriggerElement | null;
  onTriggerChange(node: SelectTriggerElement | null): void;
  valueNode: SelectValueElement | null;
  onValueNodeChange(node: SelectValueElement): void;
  valueNodeHasChildren: boolean;
  onValueNodeHasChildrenChange(hasChildren: boolean): void;
  contentId: string;
  value?: string;
  onValueChange(value: string): void;
  open: boolean;
  required?: boolean;
  onOpenChange(open: boolean): void;
  dir: SelectProps['dir'];
  triggerPointerDownPosRef: React.MutableRefObject<{ x: number; y: number } | null>;
  disabled?: boolean;
};

const [SelectProvider, useSelectContext] = createSelectContext<SelectContextValue>(SELECT_NAME);

type NativeOption = React.ReactElement<React.ComponentProps<'option'>>;

type SelectNativeOptionsContextValue = {
  onNativeOptionAdd(option: NativeOption): void;
  onNativeOptionRemove(option: NativeOption): void;
};
const [SelectNativeOptionsProvider, useSelectNativeOptionsContext] =
  createSelectContext<SelectNativeOptionsContextValue>(SELECT_NAME);

interface SelectProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?(value: string): void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  dir?: Direction;
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
}

const Select: React.FC<SelectProps> = (props: ScopedProps<SelectProps>) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
  } = props;
  const popperScope = usePopperScope(__scopeSelect);
  const [trigger, setTrigger] = React.useState<SelectTriggerElement | null>(null);
  const [valueNode, setValueNode] = React.useState<SelectValueElement | null>(null);
  const [valueNodeHasChildren, setValueNodeHasChildren] = React.useState(false);
  const direction = useDirection(dir);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const triggerPointerDownPosRef = React.useRef<{ x: number; y: number } | null>(null);

  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = trigger ? Boolean(trigger.closest('form')) : true;
  const [nativeOptionsSet, setNativeOptionsSet] = React.useState(new Set<NativeOption>());

  // The native `select` only associates the correct default value if the corresponding
  // `option` is rendered as a child **at the same time** as itself.
  // Because it might take a few renders for our items to gather the information to build
  // the native `option`(s), we generate a key on the `select` to make sure React re-builds it
  // each time the options change.
  const nativeSelectKey = Array.from(nativeOptionsSet)
    .map((option) => option.props.value)
    .join(';');

  return (
    <PopperPrimitive.Root {...popperScope}>
      <SelectProvider
        required={required}
        scope={__scopeSelect}
        trigger={trigger}
        onTriggerChange={setTrigger}
        valueNode={valueNode}
        onValueNodeChange={setValueNode}
        valueNodeHasChildren={valueNodeHasChildren}
        onValueNodeHasChildrenChange={setValueNodeHasChildren}
        contentId={useId()}
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        dir={direction}
        triggerPointerDownPosRef={triggerPointerDownPosRef}
        disabled={disabled}
      >
        <Collection.Provider scope={__scopeSelect}>
          <SelectNativeOptionsProvider
            scope={props.__scopeSelect}
            onNativeOptionAdd={React.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option));
            }, [])}
            onNativeOptionRemove={React.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev);
                optionsSet.delete(option);
                return optionsSet;
              });
            }, [])}
          >
            {children}
          </SelectNativeOptionsProvider>
        </Collection.Provider>

        {isFormControl ? (
          <BubbleSelect
            key={nativeSelectKey}
            aria-hidden
            required={required}
            tabIndex={-1}
            name={name}
            autoComplete={autoComplete}
            value={value}
            // enable form autofill
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
          >
            {value === undefined ? <option value="" /> : null}
            {Array.from(nativeOptionsSet)}
          </BubbleSelect>
        ) : null}
      </SelectProvider>
    </PopperPrimitive.Root>
  );
};

Select.displayName = SELECT_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'SelectTrigger';

type SelectTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<typeof Primitive.button>;
interface SelectTriggerProps extends PrimitiveButtonProps {}

const SelectTrigger = React.forwardRef<SelectTriggerElement, SelectTriggerProps>(
  (props: ScopedProps<SelectTriggerProps>, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(TRIGGER_NAME, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
    const getItems = useCollection(__scopeSelect);

    const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.value === context.value);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem !== undefined) {
        context.onValueChange(nextItem.value);
      }
    });

    const handleOpen = () => {
      if (!isDisabled) {
        context.onOpenChange(true);
        // reset typeahead when we open
        resetTypeahead();
      }
    };

    return (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        <Primitive.button
          type="button"
          role="combobox"
          aria-controls={context.contentId}
          aria-expanded={context.open}
          aria-required={context.required}
          aria-autocomplete="none"
          dir={context.dir}
          data-state={context.open ? 'open' : 'closed'}
          disabled={isDisabled}
          data-disabled={isDisabled ? '' : undefined}
          data-placeholder={context.value === undefined ? '' : undefined}
          {...triggerProps}
          ref={composedRefs}
          // Enable compatibility with native label or custom `Label` "click" for Safari:
          onClick={composeEventHandlers(triggerProps.onClick, (event) => {
            // Whilst browsers generally have no issue focusing the trigger when clicking
            // on a label, Safari seems to struggle with the fact that there's no `onClick`.
            // We force `focus` in this case. Note: this doesn't create any other side-effect
            // because we are preventing default in `onPointerDown` so effectively
            // this only runs for a label "click"
            event.currentTarget.focus();
          })}
          onPointerDown={composeEventHandlers(triggerProps.onPointerDown, (event) => {
            // prevent implicit pointer capture
            // https://www.w3.org/TR/pointerevents3/#implicit-pointer-capture
            const target = event.target as HTMLElement;
            if (target.hasPointerCapture(event.pointerId)) {
              target.releasePointerCapture(event.pointerId);
            }

            // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
            // but not when the control key is pressed (avoiding MacOS right click)
            if (event.button === 0 && event.ctrlKey === false) {
              handleOpen();
              context.triggerPointerDownPosRef.current = {
                x: Math.round(event.pageX),
                y: Math.round(event.pageY),
              };
              // prevent trigger from stealing focus from the active item after opening.
              event.preventDefault();
            }
          })}
          onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event) => {
            const isTypingAhead = searchRef.current !== '';
            const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
            if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
            if (isTypingAhead && event.key === ' ') return;
            if (OPEN_KEYS.includes(event.key)) {
              handleOpen();
              event.preventDefault();
            }
          })}
        />
      </PopperPrimitive.Anchor>
    );
  }
);

SelectTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectValue
 * -----------------------------------------------------------------------------------------------*/

const VALUE_NAME = 'SelectValue';

type SelectValueElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface SelectValueProps extends Omit<PrimitiveSpanProps, 'placeholder'> {
  placeholder?: React.ReactNode;
}

const SelectValue = React.forwardRef<SelectValueElement, SelectValueProps>(
  (props: ScopedProps<SelectValueProps>, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, children, placeholder, ...valueProps } = props;
    const context = useSelectContext(VALUE_NAME, __scopeSelect);
    const { onValueNodeHasChildrenChange } = context;
    const hasChildren = children !== undefined;
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);

    useLayoutEffect(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);

    return (
      <Primitive.span
        {...valueProps}
        ref={composedRefs}
        // we don't want events from the portalled `SelectValue` children to bubble
        // through the item they came from
        style={{ pointerEvents: 'none' }}
      >
        {context.value === undefined && placeholder !== undefined ? placeholder : children}
      </Primitive.span>
    );
  }
);

SelectValue.displayName = VALUE_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectIcon
 * -----------------------------------------------------------------------------------------------*/

const ICON_NAME = 'SelectIcon';

type SelectIconElement = React.ElementRef<typeof Primitive.span>;
interface SelectIconProps extends PrimitiveSpanProps {}

const SelectIcon = React.forwardRef<SelectIconElement, SelectIconProps>(
  (props: ScopedProps<SelectIconProps>, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props;
    return (
      <Primitive.span aria-hidden {...iconProps} ref={forwardedRef}>
        {children || '▼'}
      </Primitive.span>
    );
  }
);

SelectIcon.displayName = ICON_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'SelectPortal';

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface SelectPortalProps extends Omit<PortalProps, 'asChild'> {
  children?: React.ReactNode;
}

const SelectPortal: React.FC<SelectPortalProps> = (props: ScopedProps<SelectPortalProps>) => {
  return <PortalPrimitive asChild {...props} />;
};

SelectPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'SelectContent';

type SelectContentElement = SelectContentImplElement;
interface SelectContentProps extends SelectContentImplProps {}

const SelectContent = React.forwardRef<SelectContentElement, SelectContentProps>(
  (props: ScopedProps<SelectContentProps>, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME, props.__scopeSelect);
    const [fragment, setFragment] = React.useState<DocumentFragment>();

    // setting the fragment in `useLayoutEffect` as `DocumentFragment` doesn't exist on the server
    useLayoutEffect(() => {
      setFragment(new DocumentFragment());
    }, []);

    if (!context.open) {
      const frag = fragment as Element | undefined;
      return frag
        ? ReactDOM.createPortal(
            <SelectContentProvider scope={props.__scopeSelect}>
              <Collection.Slot scope={props.__scopeSelect}>
                <div>{props.children}</div>
              </Collection.Slot>
            </SelectContentProvider>,
            frag
          )
        : null;
    }

    return <SelectContentImpl {...props} ref={forwardedRef} />;
  }
);

SelectContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectContentImpl
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_MARGIN = 10;

type SelectContentContextValue = {
  content?: SelectContentElement | null;
  viewport?: SelectViewportElement | null;
  onViewportChange?: (node: SelectViewportElement | null) => void;
  itemRefCallback?: (node: SelectItemElement | null, value: string, disabled: boolean) => void;
  selectedItem?: SelectItemElement | null;
  onItemLeave?: () => void;
  itemTextRefCallback?: (
    node: SelectItemTextElement | null,
    value: string,
    disabled: boolean
  ) => void;
  focusSelectedItem?: () => void;
  selectedItemText?: SelectItemTextElement | null;
  position?: SelectContentProps['position'];
  isPositioned?: boolean;
  searchRef?: React.RefObject<string>;
};

const [SelectContentProvider, useSelectContentContext] =
  createSelectContext<SelectContentContextValue>(CONTENT_NAME);

const CONTENT_IMPL_NAME = 'SelectContentImpl';

type SelectContentImplElement = SelectPopperPositionElement | SelectItemAlignedPositionElement;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
type FocusScopeProps = Radix.ComponentPropsWithoutRef<typeof FocusScope>;

type SelectPopperPrivateProps = { onPlaced?: PopperContentProps['onPlaced'] };

interface SelectContentImplProps
  extends Omit<SelectPopperPositionProps, keyof SelectPopperPrivateProps>,
    Omit<SelectItemAlignedPositionProps, keyof SelectPopperPrivateProps> {
  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];

  position?: 'item-aligned' | 'popper';
}

const SelectContentImpl = React.forwardRef<SelectContentImplElement, SelectContentImplProps>(
  (props: ScopedProps<SelectContentImplProps>, forwardedRef) => {
    const {
      __scopeSelect,
      position = 'item-aligned',
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = useSelectContext(CONTENT_NAME, __scopeSelect);
    const [content, setContent] = React.useState<SelectContentImplElement | null>(null);
    const [viewport, setViewport] = React.useState<SelectViewportElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [selectedItem, setSelectedItem] = React.useState<SelectItemElement | null>(null);
    const [selectedItemText, setSelectedItemText] = React.useState<SelectItemTextElement | null>(
      null
    );
    const getItems = useCollection(__scopeSelect);
    const [isPositioned, setIsPositioned] = React.useState(false);
    const firstValidItemFoundRef = React.useRef(false);

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]);

    // Make sure the whole tree has focus guards as our `Select` may be
    // the last element in the DOM (because of the `Portal`)
    useFocusGuards();

    const focusFirst = React.useCallback(
      (candidates: Array<HTMLElement | null>) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
        const [lastItem] = restItems.slice(-1);

        const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
        for (const candidate of candidates) {
          // if focus is already where we want to go, we don't want to keep going through the candidates
          if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
          candidate?.scrollIntoView({ block: 'nearest' });
          // viewport might have padding so scroll to its edges when focusing first/last items.
          if (candidate === firstItem && viewport) viewport.scrollTop = 0;
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
          candidate?.focus();
          if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
        }
      },
      [getItems, viewport]
    );

    const focusSelectedItem = React.useCallback(
      () => focusFirst([selectedItem, content]),
      [focusFirst, selectedItem, content]
    );

    // Since this is not dependent on layout, we want to ensure this runs at the same time as
    // other effects across components. Hence why we don't call `focusSelectedItem` inside `position`.
    React.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem();
      }
    }, [isPositioned, focusSelectedItem]);

    // prevent selecting items on `pointerup` in some cases after opening from `pointerdown`
    // and close on `pointerup` outside.
    const { onOpenChange, triggerPointerDownPosRef } = context;
    React.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 };

        const handlePointerMove = (event: PointerEvent) => {
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0)),
          };
        };
        const handlePointerUp = (event: PointerEvent) => {
          // If the pointer hasn't moved by a certain threshold then we prevent selecting item on `pointerup`.
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault();
          } else {
            // otherwise, if the event was outside the content, close.
            if (!content.contains(event.target as HTMLElement)) {
              onOpenChange(false);
            }
          }
          document.removeEventListener('pointermove', handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };

        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener('pointermove', handlePointerMove);
          document.addEventListener('pointerup', handlePointerUp, { capture: true, once: true });
        }

        return () => {
          document.removeEventListener('pointermove', handlePointerMove);
          document.removeEventListener('pointerup', handlePointerUp, { capture: true });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);

    React.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener('blur', close);
      window.addEventListener('resize', close);
      return () => {
        window.removeEventListener('blur', close);
        window.removeEventListener('resize', close);
      };
    }, [onOpenChange]);

    const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem) {
        /**
         * Imperative focus during keydown is risky so we prevent React's batching updates
         * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
         */
        setTimeout(() => (nextItem.ref.current as HTMLElement).focus());
      }
    });

    const itemRefCallback = React.useCallback(
      (node: SelectItemElement | null, value: string, disabled: boolean) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== undefined && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node);
          if (isFirstValidItem) firstValidItemFoundRef.current = true;
        }
      },
      [context.value]
    );
    const handleItemLeave = React.useCallback(() => content?.focus(), [content]);
    const itemTextRefCallback = React.useCallback(
      (node: SelectItemTextElement | null, value: string, disabled: boolean) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== undefined && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node);
        }
      },
      [context.value]
    );

    const SelectPosition = position === 'popper' ? SelectPopperPosition : SelectItemAlignedPosition;

    // Silently ignore props that are not supported by `SelectItemAlignedPosition`
    const popperContentProps =
      SelectPosition === SelectPopperPosition
        ? {
            side,
            sideOffset,
            align,
            alignOffset,
            arrowPadding,
            collisionBoundary,
            collisionPadding,
            sticky,
            hideWhenDetached,
            avoidCollisions,
          }
        : {};

    return (
      <SelectContentProvider
        scope={__scopeSelect}
        content={content}
        viewport={viewport}
        onViewportChange={setViewport}
        itemRefCallback={itemRefCallback}
        selectedItem={selectedItem}
        onItemLeave={handleItemLeave}
        itemTextRefCallback={itemTextRefCallback}
        focusSelectedItem={focusSelectedItem}
        selectedItemText={selectedItemText}
        position={position}
        isPositioned={isPositioned}
        searchRef={searchRef}
      >
        <RemoveScroll as={Slot} allowPinchZoom>
          <FocusScope
            asChild
            // we make sure we're not trapping once it's been closed
            // (closed !== unmounted when animating out)
            trapped={context.open}
            onMountAutoFocus={(event) => {
              // we prevent open autofocus because we manually focus the selected item
              event.preventDefault();
            }}
            onUnmountAutoFocus={composeEventHandlers(onCloseAutoFocus, (event) => {
              context.trigger?.focus({ preventScroll: true });
              event.preventDefault();
            })}
          >
            <DismissableLayer
              asChild
              disableOutsidePointerEvents
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              // When focus is trapped, a focusout event may still happen.
              // We make sure we don't trigger our `onDismiss` in such case.
              onFocusOutside={(event) => event.preventDefault()}
              onDismiss={() => context.onOpenChange(false)}
            >
              <SelectPosition
                role="listbox"
                id={context.contentId}
                data-state={context.open ? 'open' : 'closed'}
                dir={context.dir}
                onContextMenu={(event) => event.preventDefault()}
                {...contentProps}
                {...popperContentProps}
                onPlaced={() => setIsPositioned(true)}
                ref={composedRefs}
                style={{
                  // flex layout so we can place the scroll buttons properly
                  display: 'flex',
                  flexDirection: 'column',
                  // reset the outline by default as the content MAY get focused
                  outline: 'none',
                  ...contentProps.style,
                }}
                onKeyDown={composeEventHandlers(contentProps.onKeyDown, (event) => {
                  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;

                  // select should not be navigated using tab key so we prevent it
                  if (event.key === 'Tab') event.preventDefault();

                  if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);

                  if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
                    const items = getItems().filter((item) => !item.disabled);
                    let candidateNodes = items.map((item) => item.ref.current!);

                    if (['ArrowUp', 'End'].includes(event.key)) {
                      candidateNodes = candidateNodes.slice().reverse();
                    }
                    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
                      const currentElement = event.target as SelectItemElement;
                      const currentIndex = candidateNodes.indexOf(currentElement);
                      candidateNodes = candidateNodes.slice(currentIndex + 1);
                    }

                    /**
                     * Imperative focus during keydown is risky so we prevent React's batching updates
                     * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
                     */
                    setTimeout(() => focusFirst(candidateNodes));

                    event.preventDefault();
                  }
                })}
              />
            </DismissableLayer>
          </FocusScope>
        </RemoveScroll>
      </SelectContentProvider>
    );
  }
);

SelectContentImpl.displayName = CONTENT_IMPL_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectItemAlignedPosition
 * -----------------------------------------------------------------------------------------------*/

const ITEM_ALIGNED_POSITION_NAME = 'SelectItemAlignedPosition';

type SelectItemAlignedPositionElement = React.ElementRef<typeof Primitive.div>;
interface SelectItemAlignedPositionProps extends PrimitiveDivProps, SelectPopperPrivateProps {}

const SelectItemAlignedPosition = React.forwardRef<
  SelectItemAlignedPositionElement,
  SelectItemAlignedPositionProps
>((props: ScopedProps<SelectItemAlignedPositionProps>, forwardedRef) => {
  const { __scopeSelect, onPlaced, ...popperProps } = props;
  const context = useSelectContext(CONTENT_NAME, __scopeSelect);
  const contentContext = useSelectContentContext(CONTENT_NAME, __scopeSelect);
  const [contentWrapper, setContentWrapper] = React.useState<HTMLDivElement | null>(null);
  const [content, setContent] = React.useState<SelectItemAlignedPositionElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
  const getItems = useCollection(__scopeSelect);
  const shouldExpandOnScrollRef = React.useRef(false);
  const shouldRepositionRef = React.useRef(true);

  const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
  const position = React.useCallback(() => {
    if (
      context.trigger &&
      context.valueNode &&
      contentWrapper &&
      content &&
      viewport &&
      selectedItem &&
      selectedItemText
    ) {
      const triggerRect = context.trigger.getBoundingClientRect();

      // -----------------------------------------------------------------------------------------
      //  Horizontal positioning
      // -----------------------------------------------------------------------------------------
      const contentRect = content.getBoundingClientRect();
      const valueNodeRect = context.valueNode.getBoundingClientRect();
      const itemTextRect = selectedItemText.getBoundingClientRect();

      if (context.dir !== 'rtl') {
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNodeRect.left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedLeft = clamp(left, [CONTENT_MARGIN, rightEdge - contentWidth]);

        contentWrapper.style.minWidth = minContentWidth + 'px';
        contentWrapper.style.left = clampedLeft + 'px';
      } else {
        const itemTextOffset = contentRect.right - itemTextRect.right;
        const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
        const rightDelta = window.innerWidth - triggerRect.right - right;
        const minContentWidth = triggerRect.width + rightDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const leftEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedRight = clamp(right, [CONTENT_MARGIN, leftEdge - contentWidth]);

        contentWrapper.style.minWidth = minContentWidth + 'px';
        contentWrapper.style.right = clampedRight + 'px';
      }

      // -----------------------------------------------------------------------------------------
      // Vertical positioning
      // -----------------------------------------------------------------------------------------
      const items = getItems();
      const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
      const itemsHeight = viewport.scrollHeight;

      const contentStyles = window.getComputedStyle(content);
      const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
      const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
      const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
      const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
      const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth; // prettier-ignore
      const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);

      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
      const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);

      const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
      const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;

      const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
      const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
      const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
      const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;

      const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;

      if (willAlignWithoutTopOverflow) {
        const isLastItem = selectedItem === items[items.length - 1].ref.current;
        contentWrapper.style.bottom = 0 + 'px';
        const viewportOffsetBottom =
          content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
        const clampedTriggerMiddleToBottomEdge = Math.max(
          triggerMiddleToBottomEdge,
          selectedItemHalfHeight +
            // viewport might have padding bottom, include it to avoid a scrollable viewport
            (isLastItem ? viewportPaddingBottom : 0) +
            viewportOffsetBottom +
            contentBorderBottomWidth
        );
        const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        contentWrapper.style.height = height + 'px';
      } else {
        const isFirstItem = selectedItem === items[0].ref.current;
        contentWrapper.style.top = 0 + 'px';
        const clampedTopEdgeToTriggerMiddle = Math.max(
          topEdgeToTriggerMiddle,
          contentBorderTopWidth +
            viewport.offsetTop +
            // viewport might have padding top, include it to avoid a scrollable viewport
            (isFirstItem ? viewportPaddingTop : 0) +
            selectedItemHalfHeight
        );
        const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
        contentWrapper.style.height = height + 'px';
        viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
      }

      contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
      contentWrapper.style.minHeight = minContentHeight + 'px';
      contentWrapper.style.maxHeight = availableHeight + 'px';
      // -----------------------------------------------------------------------------------------

      onPlaced?.();

      // we don't want the initial scroll position adjustment to trigger "expand on scroll"
      // so we explicitly turn it on only after they've registered.
      requestAnimationFrame(() => (shouldExpandOnScrollRef.current = true));
    }
  }, [
    getItems,
    context.trigger,
    context.valueNode,
    contentWrapper,
    content,
    viewport,
    selectedItem,
    selectedItemText,
    context.dir,
    onPlaced,
  ]);

  useLayoutEffect(() => position(), [position]);

  // copy z-index from content to wrapper
  const [contentZIndex, setContentZIndex] = React.useState<string>();
  useLayoutEffect(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
  }, [content]);

  // When the viewport becomes scrollable at the top, the scroll up button will mount.
  // Because it is part of the normal flow, it will push down the viewport, thus throwing our
  // trigger => selectedItem alignment off by the amount the viewport was pushed down.
  // We wait for this to happen and then re-run the positining logic one more time to account for it.
  const handleScrollButtonChange = React.useCallback(
    (node: SelectScrollButtonImplElement | null) => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem?.();
        shouldRepositionRef.current = false;
      }
    },
    [position, focusSelectedItem]
  );

  return (
    <SelectViewportProvider
      scope={__scopeSelect}
      contentWrapper={contentWrapper}
      shouldExpandOnScrollRef={shouldExpandOnScrollRef}
      onScrollButtonChange={handleScrollButtonChange}
    >
      <div
        ref={setContentWrapper}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          zIndex: contentZIndex,
        }}
      >
        <Primitive.div
          {...popperProps}
          ref={composedRefs}
          style={{
            // When we get the height of the content, it includes borders. If we were to set
            // the height without having `boxSizing: 'border-box'` it would be too big.
            boxSizing: 'border-box',
            // We need to ensure the content doesn't get taller than the wrapper
            maxHeight: '100%',
            ...popperProps.style,
          }}
        />
      </div>
    </SelectViewportProvider>
  );
});

SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectPopperPosition
 * -----------------------------------------------------------------------------------------------*/

const POPPER_POSITION_NAME = 'SelectPopperPosition';

type SelectPopperPositionElement = React.ElementRef<typeof PopperPrimitive.Content>;
type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface SelectPopperPositionProps extends PopperContentProps, SelectPopperPrivateProps {}

const SelectPopperPosition = React.forwardRef<
  SelectPopperPositionElement,
  SelectPopperPositionProps
>((props: ScopedProps<SelectPopperPositionProps>, forwardedRef) => {
  const {
    __scopeSelect,
    align = 'start',
    collisionPadding = CONTENT_MARGIN,
    ...popperProps
  } = props;
  const popperScope = usePopperScope(__scopeSelect);

  return (
    <PopperPrimitive.Content
      {...popperScope}
      {...popperProps}
      ref={forwardedRef}
      align={align}
      collisionPadding={collisionPadding}
      style={{
        // Ensure border-box for floating-ui calculations
        boxSizing: 'border-box',
        ...popperProps.style,
        // re-namespace exposed content custom properties
        ...{
          '--radix-select-content-transform-origin': 'var(--radix-popper-transform-origin)',
          '--radix-select-content-available-width': 'var(--radix-popper-available-width)',
          '--radix-select-content-available-height': 'var(--radix-popper-available-height)',
          '--radix-select-trigger-width': 'var(--radix-popper-anchor-width)',
          '--radix-select-trigger-height': 'var(--radix-popper-anchor-height)',
        },
      }}
    />
  );
});

SelectPopperPosition.displayName = POPPER_POSITION_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectViewport
 * -----------------------------------------------------------------------------------------------*/

type SelectViewportContextValue = {
  contentWrapper?: HTMLDivElement | null;
  shouldExpandOnScrollRef?: React.RefObject<boolean>;
  onScrollButtonChange?: (node: SelectScrollButtonImplElement | null) => void;
};

const [SelectViewportProvider, useSelectViewportContext] =
  createSelectContext<SelectViewportContextValue>(CONTENT_NAME, {});

const VIEWPORT_NAME = 'SelectViewport';

type SelectViewportElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface SelectViewportProps extends PrimitiveDivProps {}

const SelectViewport = React.forwardRef<SelectViewportElement, SelectViewportProps>(
  (props: ScopedProps<SelectViewportProps>, forwardedRef) => {
    const { __scopeSelect, ...viewportProps } = props;
    const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = React.useRef(0);
    return (
      <>
        {/* Hide scrollbars cross-browser and enable momentum scroll for touch devices */}
        <style
          dangerouslySetInnerHTML={{
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`,
          }}
        />
        <Collection.Slot scope={__scopeSelect}>
          <Primitive.div
            data-radix-select-viewport=""
            role="presentation"
            {...viewportProps}
            ref={composedRefs}
            style={{
              // we use position: 'relative' here on the `viewport` so that when we call
              // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
              // (independent of the scrollUpButton).
              position: 'relative',
              flex: 1,
              overflow: 'auto',
              ...viewportProps.style,
            }}
            onScroll={composeEventHandlers(viewportProps.onScroll, (event) => {
              const viewport = event.currentTarget;
              const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
              if (shouldExpandOnScrollRef?.current && contentWrapper) {
                const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
                if (scrolledBy > 0) {
                  const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                  const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                  const cssHeight = parseFloat(contentWrapper.style.height);
                  const prevHeight = Math.max(cssMinHeight, cssHeight);

                  if (prevHeight < availableHeight) {
                    const nextHeight = prevHeight + scrolledBy;
                    const clampedNextHeight = Math.min(availableHeight, nextHeight);
                    const heightDiff = nextHeight - clampedNextHeight;

                    contentWrapper.style.height = clampedNextHeight + 'px';
                    if (contentWrapper.style.bottom === '0px') {
                      viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                      // ensure the content stays pinned to the bottom
                      contentWrapper.style.justifyContent = 'flex-end';
                    }
                  }
                }
              }
              prevScrollTopRef.current = viewport.scrollTop;
            })}
          />
        </Collection.Slot>
      </>
    );
  }
);

SelectViewport.displayName = VIEWPORT_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'SelectGroup';

type SelectGroupContextValue = { id: string };

const [SelectGroupContextProvider, useSelectGroupContext] =
  createSelectContext<SelectGroupContextValue>(GROUP_NAME);

type SelectGroupElement = React.ElementRef<typeof Primitive.div>;
interface SelectGroupProps extends PrimitiveDivProps {}

const SelectGroup = React.forwardRef<SelectGroupElement, SelectGroupProps>(
  (props: ScopedProps<SelectGroupProps>, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props;
    const groupId = useId();
    return (
      <SelectGroupContextProvider scope={__scopeSelect} id={groupId}>
        <Primitive.div role="group" aria-labelledby={groupId} {...groupProps} ref={forwardedRef} />
      </SelectGroupContextProvider>
    );
  }
);

SelectGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'SelectLabel';

type SelectLabelElement = React.ElementRef<typeof Primitive.div>;
interface SelectLabelProps extends PrimitiveDivProps {}

const SelectLabel = React.forwardRef<SelectLabelElement, SelectLabelProps>(
  (props: ScopedProps<SelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props;
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
    return <Primitive.div id={groupContext.id} {...labelProps} ref={forwardedRef} />;
  }
);

SelectLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'SelectItem';

type SelectItemContextValue = {
  value: string;
  disabled: boolean;
  textId: string;
  isSelected: boolean;
  onItemTextChange(node: SelectItemTextElement | null): void;
};

const [SelectItemContextProvider, useSelectItemContext] =
  createSelectContext<SelectItemContextValue>(ITEM_NAME);

type SelectItemElement = React.ElementRef<typeof Primitive.div>;
interface SelectItemProps extends PrimitiveDivProps {
  value: string;
  disabled?: boolean;
  textValue?: string;
}

const SelectItem = React.forwardRef<SelectItemElement, SelectItemProps>(
  (props: ScopedProps<SelectItemProps>, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = useSelectContext(ITEM_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = React.useState(textValueProp ?? '');
    const [isFocused, setIsFocused] = React.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) =>
      contentContext.itemRefCallback?.(node, value, disabled)
    );
    const textId = useId();
    const isPointerDownRef = React.useRef(false);
    const isPointerUpRef = React.useRef(false);

    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };

    return (
      <SelectItemContextProvider
        scope={__scopeSelect}
        value={value}
        disabled={disabled}
        textId={textId}
        isSelected={isSelected}
        onItemTextChange={React.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? '').trim());
        }, [])}
      >
        <Collection.ItemSlot
          scope={__scopeSelect}
          value={value}
          disabled={disabled}
          textValue={textValue}
        >
          <Primitive.div
            role="option"
            aria-labelledby={textId}
            data-highlighted={isFocused ? '' : undefined}
            // `isFocused` caveat fixes stuttering in VoiceOver
            aria-selected={isSelected && isFocused}
            data-state={isSelected ? 'checked' : 'unchecked'}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            {...itemProps}
            ref={composedRefs}
            onFocus={composeEventHandlers(itemProps.onFocus, () => setIsFocused(true))}
            onBlur={composeEventHandlers(itemProps.onBlur, () => setIsFocused(false))}
            onClick={composeEventHandlers(itemProps.onClick, () => {
              if (isPointerUpRef.current) handleSelect();
            })}
            onPointerUp={composeEventHandlers(itemProps.onPointerUp, (event) => {
              isPointerUpRef.current = true;
              if (!isPointerDownRef.current) event.currentTarget.click();
            })}
            onPointerDown={composeEventHandlers(
              itemProps.onPointerDown,
              () => (isPointerDownRef.current = true)
            )}
            onPointerMove={composeEventHandlers(itemProps.onPointerMove, (event) => {
              if (disabled) {
                contentContext.onItemLeave?.();
              } else {
                // even though safari doesn't support this option, it's acceptable
                // as it only means it might scroll a few pixels when using the pointer.
                event.currentTarget.focus({ preventScroll: true });
              }
            })}
            onPointerLeave={composeEventHandlers(itemProps.onPointerLeave, (event) => {
              if (event.currentTarget === document.activeElement) {
                contentContext.onItemLeave?.();
              }
            })}
            onKeyDown={composeEventHandlers(itemProps.onKeyDown, (event) => {
              const isTypingAhead = contentContext.searchRef?.current !== '';
              if (isTypingAhead && event.key === ' ') return;
              if (SELECTION_KEYS.includes(event.key)) handleSelect();
              // prevent page scroll if using the space key to select an item
              if (event.key === ' ') event.preventDefault();
            })}
          />
        </Collection.ItemSlot>
      </SelectItemContextProvider>
    );
  }
);

SelectItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectItemText
 * -----------------------------------------------------------------------------------------------*/

const ITEM_TEXT_NAME = 'SelectItemText';

type SelectItemTextElement = React.ElementRef<typeof Primitive.span>;
interface SelectItemTextProps extends PrimitiveSpanProps {}

const SelectItemText = React.forwardRef<SelectItemTextElement, SelectItemTextProps>(
  (props: ScopedProps<SelectItemTextProps>, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, ...itemTextProps } = props;
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = React.useState<SelectItemTextElement | null>(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled)
    );

    const textContent = itemTextNode?.textContent;
    const nativeOption = React.useMemo(
      () => (
        <option key={itemContext.value} value={itemContext.value} disabled={itemContext.disabled}>
          {textContent}
        </option>
      ),
      [itemContext.disabled, itemContext.value, textContent]
    );

    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
    useLayoutEffect(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);

    return (
      <>
        <Primitive.span id={itemContext.textId} {...itemTextProps} ref={composedRefs} />

        {/* Portal the select item text into the trigger value node */}
        {itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren
          ? ReactDOM.createPortal(itemTextProps.children, context.valueNode)
          : null}
      </>
    );
  }
);

SelectItemText.displayName = ITEM_TEXT_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'SelectItemIndicator';

type SelectItemIndicatorElement = React.ElementRef<typeof Primitive.span>;
interface SelectItemIndicatorProps extends PrimitiveSpanProps {}

const SelectItemIndicator = React.forwardRef<SelectItemIndicatorElement, SelectItemIndicatorProps>(
  (props: ScopedProps<SelectItemIndicatorProps>, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props;
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect);
    return itemContext.isSelected ? (
      <Primitive.span aria-hidden {...itemIndicatorProps} ref={forwardedRef} />
    ) : null;
  }
);

SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectScrollUpButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_UP_BUTTON_NAME = 'SelectScrollUpButton';

type SelectScrollUpButtonElement = SelectScrollButtonImplElement;
interface SelectScrollUpButtonProps extends Omit<SelectScrollButtonImplProps, 'onAutoScroll'> {}

const SelectScrollUpButton = React.forwardRef<
  SelectScrollUpButtonElement,
  SelectScrollUpButtonProps
>((props: ScopedProps<SelectScrollUpButtonProps>, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);

  useLayoutEffect(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      const viewport = contentContext.viewport;
      function handleScroll() {
        const canScrollUp = viewport.scrollTop > 0;
        setCanScrollUp(canScrollUp);
      }
      handleScroll();
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);

  return canScrollUp ? (
    <SelectScrollButtonImpl
      {...props}
      ref={composedRefs}
      onAutoScroll={() => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
        }
      }}
    />
  ) : null;
});

SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectScrollDownButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_DOWN_BUTTON_NAME = 'SelectScrollDownButton';

type SelectScrollDownButtonElement = SelectScrollButtonImplElement;
interface SelectScrollDownButtonProps extends Omit<SelectScrollButtonImplProps, 'onAutoScroll'> {}

const SelectScrollDownButton = React.forwardRef<
  SelectScrollDownButtonElement,
  SelectScrollDownButtonProps
>((props: ScopedProps<SelectScrollDownButtonProps>, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const [canScrollDown, setCanScrollDown] = React.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);

  useLayoutEffect(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      const viewport = contentContext.viewport;
      function handleScroll() {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        // we use Math.ceil here because if the UI is zoomed-in
        // `scrollTop` is not always reported as an integer
        const canScrollDown = Math.ceil(viewport.scrollTop) < maxScroll;
        setCanScrollDown(canScrollDown);
      }
      handleScroll();
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);

  return canScrollDown ? (
    <SelectScrollButtonImpl
      {...props}
      ref={composedRefs}
      onAutoScroll={() => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
        }
      }}
    />
  ) : null;
});

SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME;

type SelectScrollButtonImplElement = React.ElementRef<typeof Primitive.div>;
interface SelectScrollButtonImplProps extends PrimitiveDivProps {
  onAutoScroll(): void;
}

const SelectScrollButtonImpl = React.forwardRef<
  SelectScrollButtonImplElement,
  SelectScrollButtonImplProps
>((props: ScopedProps<SelectScrollButtonImplProps>, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
  const contentContext = useSelectContentContext('SelectScrollButton', __scopeSelect);
  const autoScrollTimerRef = React.useRef<number | null>(null);
  const getItems = useCollection(__scopeSelect);

  const clearAutoScrollTimer = React.useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);

  // When the viewport becomes scrollable on either side, the relevant scroll button will mount.
  // Because it is part of the normal flow, it will push down (top button) or shrink (bottom button)
  // the viewport, potentially causing the active item to now be partially out of view.
  // We re-run the `scrollIntoView` logic to make sure it stays within the viewport.
  useLayoutEffect(() => {
    const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
    activeItem?.ref.current?.scrollIntoView({ block: 'nearest' });
  }, [getItems]);

  return (
    <Primitive.div
      aria-hidden
      {...scrollIndicatorProps}
      ref={forwardedRef}
      style={{ flexShrink: 0, ...scrollIndicatorProps.style }}
      onPointerMove={composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        contentContext.onItemLeave?.();
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      })}
      onPointerLeave={composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer();
      })}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * SelectSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'SelectSeparator';

type SelectSeparatorElement = React.ElementRef<typeof Primitive.div>;
interface SelectSeparatorProps extends PrimitiveDivProps {}

const SelectSeparator = React.forwardRef<SelectSeparatorElement, SelectSeparatorProps>(
  (props: ScopedProps<SelectSeparatorProps>, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props;
    return <Primitive.div aria-hidden {...separatorProps} ref={forwardedRef} />;
  }
);

SelectSeparator.displayName = SEPARATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * SelectArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'SelectArrow';

type SelectArrowElement = React.ElementRef<typeof PopperPrimitive.Arrow>;
type PopperArrowProps = Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface SelectArrowProps extends PopperArrowProps {}

const SelectArrow = React.forwardRef<SelectArrowElement, SelectArrowProps>(
  (props: ScopedProps<SelectArrowProps>, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(ARROW_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
    return context.open && contentContext.position === 'popper' ? (
      <PopperPrimitive.Arrow {...popperScope} {...arrowProps} ref={forwardedRef} />
    ) : null;
  }
);

SelectArrow.displayName = ARROW_NAME;

/* -----------------------------------------------------------------------------------------------*/

const BubbleSelect = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<'select'>>(
  (props, forwardedRef) => {
    const { value, ...selectProps } = props;
    const ref = React.useRef<HTMLSelectElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const prevValue = usePrevious(value);

    // Bubble value change to parents (e.g form change event)
    React.useEffect(() => {
      const select = ref.current!;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        selectProto,
        'value'
      ) as PropertyDescriptor;
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event('change', { bubbles: true });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);

    /**
     * We purposefully use a `select` here to support form autofill as much
     * as possible.
     *
     * We purposefully do not add the `value` attribute here to allow the value
     * to be set programatically and bubble to any parent form `onChange` event.
     * Adding the `value` will cause React to consider the programatic
     * dispatch a duplicate and it will get swallowed.
     *
     * We use `VisuallyHidden` rather than `display: "none"` because Safari autofill
     * won't work otherwise.
     */
    return (
      <VisuallyHidden asChild>
        <select {...selectProps} ref={composedRefs} defaultValue={value} />
      </VisuallyHidden>
    );
  }
);

BubbleSelect.displayName = 'BubbleSelect';

function useTypeaheadSearch(onSearchChange: (search: string) => void) {
  const handleSearchChange = useCallbackRef(onSearchChange);
  const searchRef = React.useRef('');
  const timerRef = React.useRef(0);

  const handleTypeaheadSearch = React.useCallback(
    (key: string) => {
      const search = searchRef.current + key;
      handleSearchChange(search);

      (function updateSearch(value: string) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        // Reset `searchRef` 1 second after it was last updated
        if (value !== '') timerRef.current = window.setTimeout(() => updateSearch(''), 1000);
      })(search);
    },
    [handleSearchChange]
  );

  const resetTypeahead = React.useCallback(() => {
    searchRef.current = '';
    window.clearTimeout(timerRef.current);
  }, []);

  React.useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  return [searchRef, handleTypeaheadSearch, resetTypeahead] as const;
}

/**
 * This is the "meat" of the typeahead matching logic. It takes in a list of items,
 * the search and the current item, and returns the next item (or `undefined`).
 *
 * We normalize the search because if a user has repeatedly pressed a character,
 * we want the exact same behavior as if we only had that one character
 * (ie. cycle through items starting with that character)
 *
 * We also reorder the items by wrapping the array around the current item.
 * This is so we always look forward from the current item, and picking the first
 * item will always be the correct one.
 *
 * Finally, if the normalized search is exactly one character, we exclude the
 * current item from the values because otherwise it would be the first to match always
 * and focus would never move. This is as opposed to the regular case, where we
 * don't want focus to move if the current item still matches.
 */
function findNextItem<T extends { textValue: string }>(
  items: T[],
  search: string,
  currentItem?: T
) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
  let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
  const excludeCurrentItem = normalizedSearch.length === 1;
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
  const nextItem = wrappedItems.find((item) =>
    item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextItem !== currentItem ? nextItem : undefined;
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}

const Root = Select;
const Trigger = SelectTrigger;
const Value = SelectValue;
const Icon = SelectIcon;
const Portal = SelectPortal;
const Content = SelectContent;
const Viewport = SelectViewport;
const Group = SelectGroup;
const Label = SelectLabel;
const Item = SelectItem;
const ItemText = SelectItemText;
const ItemIndicator = SelectItemIndicator;
const ScrollUpButton = SelectScrollUpButton;
const ScrollDownButton = SelectScrollDownButton;
const Separator = SelectSeparator;
const Arrow = SelectArrow;

export {
  createSelectScope,
  //
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSeparator,
  SelectArrow,
  //
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Viewport,
  Group,
  Label,
  Item,
  ItemText,
  ItemIndicator,
  ScrollUpButton,
  ScrollDownButton,
  Separator,
  Arrow,
};
export type {
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIconProps,
  SelectPortalProps,
  SelectContentProps,
  SelectViewportProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectItemProps,
  SelectItemTextProps,
  SelectItemIndicatorProps,
  SelectScrollUpButtonProps,
  SelectScrollDownButtonProps,
  SelectSeparatorProps,
  SelectArrowProps,
};
