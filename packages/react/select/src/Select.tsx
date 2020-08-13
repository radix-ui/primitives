import * as React from 'react';
import { makeId } from '@interop-ui/utils';
import {
  composeEventHandlers,
  createContext,
  forwardRef,
  useCallbackRef,
  useComposedRefs,
  useControlledState,
  useId,
  usePrevious,
  useUpdateEffect,
} from '@interop-ui/react-utils';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { createCollection, Item as CollectionItem } from '@interop-ui/react-collection';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { Popover, PopoverProps } from '@interop-ui/react-popover';
import { Lock } from '@interop-ui/react-lock';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import {
  canProcessTypeahead,
  getFirstSelectableIndex,
  getItemIndexForValue,
  getItemLabelForValue,
  getNextSelectableIndex,
  getLastSelectableIndex,
  getTypeaheadIndex,
  makeItemId,
  useSelectValueState,
  useSelfResettingState,
} from './utils';

const selectSpecificProps = [
  'defaultValue',
  'disabled',
  'form',
  'multiple',
  'name',
  'required',
  'onChange',
  'size',
  'value',
  'autoComplete',
  'autoFocus',
] as const;
type SelectSpecificProps = typeof selectSpecificProps[number];

type SelectCollectionState = { isDisabled: boolean; value: string };
type SelectOptionItem = CollectionItem<
  HTMLElementTagNameMap[typeof OPTION_DEFAULT_TAG],
  SelectCollectionState
>;

const [createSelectCollection, useSelectItem, useSelectItems] = createCollection<
  HTMLElementTagNameMap[typeof OPTION_DEFAULT_TAG],
  SelectCollectionState
>('Select');

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'Select.Root';

type SelectContextValue = {
  ariaDescribedBy: SelectRootProps['aria-describedby'];
  ariaLabel: SelectRootProps['aria-label'];
  ariaLabelledBy: SelectRootProps['aria-labelledby'];
  autoFocus: boolean;
  buttonId: string;
  buttonRef: React.RefObject<HTMLElementTagNameMap[typeof BUTTON_DEFAULT_TAG]>;
  buttonTextRef: React.RefObject<HTMLElementTagNameMap[typeof BUTTON_LABEL_DEFAULT_TAG]>;
  disabled: boolean;
  form: SelectRootProps['form'];
  highlightedIndex: number | undefined;
  isOpen: boolean;
  onItemSelected: NonNullable<SelectRootProps['onItemSelected']>;
  listId: string;
  name: SelectRootProps['name'];
  readOnly: boolean;
  required: boolean;
  tabIndex: SelectRootProps['tabIndex'];
  typeaheadBuffer: string | undefined;
  value: string | undefined;
  onListNavigate: SelectRootProps['onListNavigate'];
  onKeyboardListNavigate: SelectRootProps['onKeyboardListNavigate'];
};

type SelectDispatcherContextValue = {
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTypeaheadBuffer: React.Dispatch<React.SetStateAction<string | undefined>>;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  selectItem(item?: SelectOptionItem): void;
  clickOptionAtIndex(index?: number): void;
};

// const UsesNativeSelectContext = React.createContext(false);
const [SelectDispatcherContext, useSelectDispatchContext] = createContext<
  SelectDispatcherContextValue
>('SelectDispatcherContext', ROOT_NAME);
const [SelectContext, useSelectContext] = createContext<SelectContextValue>(
  'SelectContext',
  ROOT_NAME
);

/* -------------------------------------------------------------------------------------------------
 * SelectRoot
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'div';

type SelectRootOwnProps = {
  // autoComplete?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  form?: string;
  isOpen?: boolean;
  name?: string;
  onIsOpenChange?: (isOpen?: boolean) => void;
  onValueChange?: (value?: string) => void;
  onItemSelected?: (item: SelectOptionItem) => void;
  onListNavigate?: (index: number | undefined) => void;
  onKeyboardListNavigate?: (index: number | undefined) => void;
  readOnly?: boolean;
  required?: boolean;
  size?: number;
  value?: string;
  'aria-label'?: React.ComponentProps<'input'>['aria-label'];
  'aria-labelledby'?: React.ComponentProps<'input'>['aria-labelledby'];
  'aria-describedby'?: React.ComponentProps<'input'>['aria-describedby'];
  tabIndex?: React.ComponentProps<'input'>['tabIndex'];
  id?: React.ComponentProps<'input'>['id'];
};
type SelectRootProps = SelectRootOwnProps;

const SelectRoot = createSelectCollection<typeof DEFAULT_TAG, SelectRootProps>(function SelectRoot(
  props
) {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    autoFocus = false,
    children,
    defaultValue,
    disabled = false,
    id,
    isOpen: isOpenProp,
    name,
    form,
    onIsOpenChange,
    onValueChange,
    onItemSelected: onItemSelectedProp = () => void null,
    onListNavigate: onListNavigateProp = () => void null,
    onKeyboardListNavigate: onKeyboardListNavigateProp = () => void null,
    readOnly = false,
    required = false,
    size,
    tabIndex,
    value: valueProp,
  } = props;

  // TODO: Collection stuff
  const items = useSelectItems();

  const generatedSelectId = makeId('select', useId());
  const selectId = String(id || generatedSelectId);
  const buttonId = makeId('button', selectId);
  const listId = makeId('menu', selectId);

  const [_isOpen, setIsOpen] = useControlledState({ prop: isOpenProp, onChange: onIsOpenChange });
  const isOpen = Boolean(_isOpen);
  const prevIsOpen = usePrevious(isOpen);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | undefined>();
  const isValueControlled = 'value' in props;
  const [value, setValue] = useSelectValueState(items, {
    isValueControlled,
    value: valueProp,
    defaultValue,
    onValueChange,
  });
  const [typeaheadBuffer, setTypeaheadBuffer] = useSelfResettingState<string>();

  const buttonRef = React.useRef<HTMLElementTagNameMap[typeof BUTTON_DEFAULT_TAG]>(null);
  const buttonTextRef = React.useRef<HTMLElementTagNameMap[typeof BUTTON_LABEL_DEFAULT_TAG]>(null);

  const onKeyboardListNavigate = useCallbackRef(onKeyboardListNavigateProp);
  const onListNavigate = useCallbackRef(onListNavigateProp);
  const onItemSelected = useCallbackRef(onItemSelectedProp);
  useUpdateEffect(() => {
    onListNavigate && onListNavigate(highlightedIndex);
  }, [highlightedIndex, onListNavigate]);

  // whenever the menu opens:
  // - highlight the selected option
  React.useEffect(() => {
    const hasOpened = !prevIsOpen && isOpen;

    if (hasOpened) {
      const index = getItemIndexForValue(items, value);
      const item = items[index];
      if (item && !item.isDisabled) {
        setHighlightedIndex(index);
      }
    }
  }, [prevIsOpen, isOpen, items, value]);

  const selectItem = React.useCallback(
    function selectItem(item?: SelectOptionItem) {
      setValue(item ? item.value : undefined);
    },
    [setValue]
  );

  /**
   * Selects an item by index, finds its DOM element and fires a click event on it.
   * This then goes into the same flow as if the user had clicked on the item.
   */
  const clickOptionAtIndex = React.useCallback(
    function clickOptionAtIndex(index?: number) {
      const selectedItem = index !== undefined ? items[index] : undefined;
      const selectedMenuItem = selectedItem && selectedItem.ref ? selectedItem.ref.current : null;
      if (selectedMenuItem) {
        (selectedMenuItem as any)?.click();
      }
    },
    [items]
  );

  const ctx: SelectContextValue = React.useMemo(() => {
    return {
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      autoFocus,
      buttonId,
      buttonRef,
      buttonTextRef,
      disabled,
      form,
      highlightedIndex,
      isOpen,
      listId,
      name,
      onKeyboardListNavigate,
      onItemSelected,
      onListNavigate,
      readOnly,
      required,
      tabIndex,
      typeaheadBuffer,
      value,
    };
  }, [
    ariaDescribedBy,
    ariaLabel,
    ariaLabelledBy,
    autoFocus,
    buttonId,
    disabled,
    form,
    highlightedIndex,
    isOpen,
    listId,
    name,
    onItemSelected,
    onKeyboardListNavigate,
    onListNavigate,
    readOnly,
    required,
    tabIndex,
    typeaheadBuffer,
    value,
  ]);

  const dispatcherCtx: SelectDispatcherContextValue = React.useMemo(
    () => ({
      setHighlightedIndex,
      setIsOpen,
      setTypeaheadBuffer,
      setValue,
      selectItem,
      clickOptionAtIndex,
    }),
    [clickOptionAtIndex, selectItem, setIsOpen, setTypeaheadBuffer, setValue]
  );

  return (
    <SelectDispatcherContext.Provider value={dispatcherCtx}>
      <SelectContext.Provider value={ctx}>
        {/* BUTTON GOES HERE */}
        {/* HIDDEN INPUT GOES HERE */}
        {/* POPOVER GOES HERE */}
        {children}
      </SelectContext.Provider>
    </SelectDispatcherContext.Provider>
  );
});

SelectRoot.displayName = 'Select.Root';

/* -------------------------------------------------------------------------------------------------
 * SelectHiddenInput
 * -----------------------------------------------------------------------------------------------*/

const HIDDEN_INPUT_NAME = 'Select.HiddenInput';
const HIDDEN_INPUT_DEFAULT_TAG = 'input';

type SelectHiddenInputDOMProps = React.ComponentPropsWithRef<typeof HIDDEN_INPUT_DEFAULT_TAG>;
type SelectHiddenInputOwnProps = {};
type SelectHiddenInputProps = SelectHiddenInputDOMProps & SelectHiddenInputOwnProps;

const SelectHiddenInput = forwardRef<typeof HIDDEN_INPUT_DEFAULT_TAG, SelectHiddenInputProps>(
  function SelectHiddenInput(props, forwardedRef) {
    const { as: Comp = HIDDEN_INPUT_DEFAULT_TAG, onFocus, ...inputProps } = props;
    const { name, form, readOnly, value, buttonRef } = useSelectContext(HIDDEN_INPUT_NAME);

    return (
      <VisuallyHidden>
        {/* Using `VisuallyHidden` here as a subsitute for `input type="hidden"` because it wasn't focusable */}
        <Comp
          ref={forwardedRef as React.Ref<HTMLInputElement>}
          type="text"
          aria-hidden
          {...inputProps}
          value={value}
          onChange={() => {}}
          name={name}
          form={form}
          readOnly={readOnly}
          // focusable programmatically but not in the tab order
          tabIndex={-1}
          // if the input gets focused (via forwardedRef) we move focus to the button
          onFocus={composeEventHandlers(onFocus, (event) => {
            buttonRef.current?.focus();
          })}
        />
      </VisuallyHidden>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SelectButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'Select.Button';
const BUTTON_DEFAULT_TAG = 'button';

type SelectButtonDOMProps = React.ComponentPropsWithRef<typeof BUTTON_DEFAULT_TAG>;
type SelectButtonOwnProps = {};
type SelectButtonProps = SelectButtonDOMProps & SelectButtonOwnProps;

const SelectButton = forwardRef<typeof BUTTON_DEFAULT_TAG, SelectButtonProps>(function SelectButton(
  props,
  forwardedRef
) {
  const { as: Comp = BUTTON_DEFAULT_TAG, children, onKeyDown, onMouseDown, ...domProps } = props;
  const {
    ariaLabel,
    ariaLabelledBy,
    autoFocus,
    buttonId,
    buttonRef,
    disabled,
    isOpen,
    listId,
    readOnly,
    tabIndex,
    typeaheadBuffer,
    value,
  } = useSelectContext(BUTTON_NAME);
  const { setIsOpen, setTypeaheadBuffer, setValue } = useSelectDispatchContext(BUTTON_NAME);
  const items = useSelectItems();

  const handleMouseDown = useCallbackRef(
    composeEventHandlers(onMouseDown, function handleMouseDown(event) {
      if (readOnly) {
        return;
      }

      // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
      // but not when the control key is pressed (avoiding MacOS right click)
      if (event.button === 0 && event.ctrlKey === false) {
        setIsOpen(true);
      }
    })
  );

  const handleKeyDown = useCallbackRef(
    composeEventHandlers(onKeyDown, function handleKeyDown(event) {
      if (Boolean(readOnly)) {
        return;
      }

      // disable button defaults
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
      }

      if (canProcessTypeahead(event)) {
        const isBuffering = typeaheadBuffer !== undefined;
        if (event.key === ' ' && !isBuffering) {
          setIsOpen(true);
        } else {
          const updatedBuffer = (typeaheadBuffer || '') + event.key;
          setTypeaheadBuffer(updatedBuffer);
          const typeaheadIndex = getTypeaheadIndex({
            items,
            currentIndex: getItemLabelForValue(items, value),
            searchBuffer: updatedBuffer,
          });

          // TODO: Fix typing in collections so we can remove cast to any
          const typeaheadValue =
            typeaheadIndex !== undefined ? (items[typeaheadIndex] as any).value : undefined;
          setValue(typeaheadValue);
        }
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
      }
    })
  );

  return (
    <Comp
      id={buttonId}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy === undefined ? buttonId : `${buttonId} ${ariaLabelledBy}`}
      aria-describedby={props['aria-describedby']}
      // aria-required={required}
      aria-haspopup="listbox"
      aria-owns={isOpen ? listId : undefined}
      aria-expanded={isOpen === true ? true : undefined}
      // other props
      ref={useComposedRefs(forwardedRef, buttonRef)}
      type="button"
      disabled={disabled}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      {...domProps}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    >
      {/* BUTTON LABEL GOES HERE */}
      {/* BUTTON ICON GOES HERE */}
      {children}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SelectButtonLabel
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_LABEL_NAME = 'Select.ButtonLabel';
const BUTTON_LABEL_DEFAULT_TAG = 'span';

type SelectButtonLabelDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_LABEL_DEFAULT_TAG>;
type SelectButtonLabelOwnProps = {};
type SelectButtonLabelProps = SelectButtonLabelDOMProps & SelectButtonLabelOwnProps;

const SelectButtonLabel = forwardRef<typeof BUTTON_LABEL_DEFAULT_TAG, SelectButtonProps>(
  function SelectButtonLabel(props, forwardedRef) {
    const { as: Comp = BUTTON_LABEL_DEFAULT_TAG, children, ...domProps } = props;
    const { buttonTextRef, value } = useSelectContext(BUTTON_LABEL_NAME);
    const items = useSelectItems();
    const selectedOptionLabel = getItemLabelForValue(items, value);
    const ref = useComposedRefs(buttonTextRef, forwardedRef);
    return (
      <Comp ref={ref} {...domProps}>
        {selectedOptionLabel}
      </Comp>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SelectButtonIcon
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_ICON_NAME = 'Select.ButtonIcon';

type SelectButtonIconDOMProps = React.ComponentPropsWithRef<'svg'>;
type SelectButtonIconOwnProps = {};
type SelectButtonIconProps = SelectButtonIconDOMProps & SelectButtonIconOwnProps;

const SelectButtonIcon = React.forwardRef<SVGSVGElement, SelectButtonIconProps>(
  function SelectButtonIcon(props, forwardedRef) {
    let { width = 6, height = 15, ...domProps } = props;
    return (
      <svg
        aria-hidden
        ref={forwardedRef}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 6 15"
        fill="none"
        stroke="currentColor"
        {...domProps}
      >
        <path d="M5 5.5L3 3.5L1 5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5L3 11.5L1 9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SelectOption
 * -----------------------------------------------------------------------------------------------*/

const OPTION_NAME = 'Select.Option';
const OPTION_DEFAULT_TAG = 'div';

type SelectOptionDomProps = Omit<
  React.ComponentPropsWithoutRef<typeof OPTION_DEFAULT_TAG>,
  'value' | 'defaultValue'
>;
type SelectOptionOwnProps = {
  value: string;
  isDisabled?: boolean;
  isGrouped?: boolean;
  onSelect?: () => void;
};
type SelectOptionProps = SelectOptionDomProps & SelectOptionOwnProps;

const SelectOption = forwardRef<typeof OPTION_DEFAULT_TAG, SelectOptionProps>(function SelectOption(
  props,
  forwardedRef
) {
  const {
    as: Comp = OPTION_DEFAULT_TAG,
    children,
    value,
    onSelect: onSelectProp = () => void null,
    onClick,
    onMouseDown,
    onMouseMove,
    isGrouped = false,
    isDisabled = false,
    ...optionProps
  } = props;
  const {
    isOpen,
    listId,
    highlightedIndex,
    value: listboxValue,
    onItemSelected,
  } = useSelectContext(OPTION_NAME);
  const { setHighlightedIndex, setIsOpen } = useSelectDispatchContext(OPTION_NAME);
  const onSelect = useCallbackRef(onSelectProp);
  const [item, index] = useSelectItem({ isDisabled, value });
  const items = useSelectItems();
  const isHighlighted = index === highlightedIndex;
  const isSelected = listboxValue === value;
  const id = makeItemId(listId, index);
  const optionRef = useComposedRefs(forwardedRef, item.ref as any);

  const selectItem = React.useCallback(
    function selectItem() {
      if (!isDisabled) {
        onSelect();
        setIsOpen(false);
        onItemSelected && onItemSelected(item);
      }
    },
    [isDisabled, item, onItemSelected, onSelect, setIsOpen]
  );

  // mimic the native menu which select on right click
  const handleMouseDown = React.useCallback(
    function onMouseDown(event: React.MouseEvent) {
      if (event.button === 2) {
        selectItem();
      }
    },
    [selectItem]
  );

  const highlightItem = React.useCallback(
    function highlightItem() {
      setHighlightedIndex(isDisabled ? undefined : index);
    },
    [isDisabled, index, setHighlightedIndex]
  );

  return (
    <Comp
      id={id}
      role="option"
      aria-disabled={isDisabled ? true : undefined}
      aria-selected={(isOpen ? isHighlighted : isSelected) || undefined}
      // we explicitely set the size and position in set
      // to ignore any other item placed in between by the user
      aria-setsize={items.length}
      aria-posinset={index + 1}
      data-highlighted={isHighlighted}
      data-disabled={isDisabled}
      data-grouped={isGrouped}
      data-selected={isSelected}
      onClick={composeEventHandlers(onClick, selectItem)}
      onMouseDown={composeEventHandlers(onMouseDown, handleMouseDown)}
      onMouseMove={composeEventHandlers(onMouseMove, highlightItem)}
      {...optionProps}
      ref={optionRef as any}
    >
      {children}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SelectOptionGroup
 * -----------------------------------------------------------------------------------------------*/

type SelectOptionGroupOwnProps = {
  label?: string;
  disabled?: boolean;
};

/* -------------------------------------------------------------------------------------------------
 * SelectPopover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_NAME = 'Select.Popover';
const POPOVER_DEFAULT_TAG = 'div';
type SelectPopoverOwnProps = {
  shouldPortal?: PopoverProps['shouldPortal'];
};
type SelectPopoverProps = SelectPopoverOwnProps;

const SelectPopover = forwardRef<typeof POPOVER_DEFAULT_TAG, SelectPopoverProps>(
  function SelectPopover(props, forwardedRef) {
    const { as = POPOVER_DEFAULT_TAG, children, shouldPortal = true, ...popoverProps } = props;
    const { isOpen, buttonRef } = useSelectContext(POPOVER_NAME);
    const { setIsOpen } = useSelectDispatchContext(POPOVER_NAME);
    const debugContext = useDebugContext();

    return (
      <Popover
        as={as}
        hidden={!isOpen}
        isOpen={isOpen}
        ref={forwardedRef}
        renderOnlyWhileOpen={false}
        shouldPortal={shouldPortal}
        tabIndex={-1}
        targetRef={buttonRef}
        {...popoverProps}
      >
        <Lock
          isActive={debugContext.disableLock ? false : isOpen}
          onDeactivate={() => setIsOpen(false)}
          refToFocusOnDeactivation={buttonRef}
          shouldDeactivateOnEscape
          shouldDeactivateOnOutsideClick
          shouldBlockOutsideClick
        >
          {children}
        </Lock>
      </Popover>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * SelectList
 * -----------------------------------------------------------------------------------------------*/

const LIST_NAME = 'Select.List';
const LIST_DEFAULT_TAG = 'div';
type SelectListOwnProps = {};
type SelectListProps = SelectListOwnProps;

const SelectList = forwardRef<typeof LIST_DEFAULT_TAG, SelectListProps>(function SelectList(
  props,
  forwardedRef
) {
  const { as: Comp = LIST_DEFAULT_TAG, children, onKeyDown, onMouseLeave, ...domProps } = props;
  const {
    isOpen,
    highlightedIndex,
    listId,
    typeaheadBuffer,
    onKeyboardListNavigate,
  } = useSelectContext(LIST_NAME);
  const { clickOptionAtIndex, setHighlightedIndex, setTypeaheadBuffer } = useSelectDispatchContext(
    LIST_NAME
  );

  /**
   * Sets the highlighted index and scrolls the menu
   * to make sure the associated menu item is always visible in view.
   * This method should be used when setting the highlighted index via keyboard.
   */
  function setHighlightedIndexViaKeyboard(index?: number) {
    setHighlightedIndex(index);
    onKeyboardListNavigate && onKeyboardListNavigate(index);
  }

  const items = useSelectItems();

  // whenever the menu is open
  // - prevent the native context menu from showing up
  // - also prevent any of our own menus to show up if nested menus exist
  //   (because we also check for defaultPrevented )
  React.useEffect(() => {
    function handleContextMenu(event: MouseEvent) {
      event.preventDefault();
    }
    if (isOpen) {
      document.addEventListener('contextmenu', handleContextMenu, { capture: true });
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      };
    }
    return;
  }, [isOpen]);

  return (
    <Comp
      id={listId}
      role="listbox"
      aria-activedescendant={
        highlightedIndex !== undefined ? makeItemId(listId, highlightedIndex) : undefined
      }
      tabIndex={0}
      onKeyDown={composeEventHandlers(onKeyDown, function handleKeyDown(event) {
        // to make sure we  don't also trigger top-level shortcuts for example
        event.stopPropagation();

        if (canProcessTypeahead(event)) {
          event.preventDefault();
          const isBuffering = typeaheadBuffer !== undefined;

          if (event.key === ' ' && !isBuffering) {
            clickOptionAtIndex(highlightedIndex);
          } else {
            const updatedBuffer = (typeaheadBuffer || '') + event.key;
            setTypeaheadBuffer(updatedBuffer);

            const typeaheadIndex = getTypeaheadIndex({
              items,
              currentIndex: highlightedIndex,
              searchBuffer: updatedBuffer,
            });

            setHighlightedIndexViaKeyboard(typeaheadIndex);
          }
        }

        switch (event.key) {
          case 'ArrowUp':
          case 'ArrowDown':
            event.preventDefault();
            setHighlightedIndexViaKeyboard(
              getNextSelectableIndex({
                items,
                currentIndex: highlightedIndex,
                key: event.key,
              })
            );
            break;

          case 'Enter':
            event.preventDefault();
            clickOptionAtIndex(highlightedIndex);
            break;

          case 'Home':
          case 'PageUp':
            event.preventDefault();
            setHighlightedIndexViaKeyboard(getFirstSelectableIndex(items));
            break;

          case 'End':
          case 'PageDown':
            event.preventDefault();
            setHighlightedIndexViaKeyboard(getLastSelectableIndex(items));
            break;
        }
      })}
      onMouseLeave={composeEventHandlers(onMouseLeave, function handleMouseLeave() {
        setHighlightedIndex(undefined);
      })}
      {...domProps}
    >
      {children}
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Composed Select
 * -----------------------------------------------------------------------------------------------*/

const SELECT_DEFAULT_TAG = BUTTON_DEFAULT_TAG;

type SelectDOMProps = React.ComponentPropsWithoutRef<typeof SELECT_DEFAULT_TAG>;
type SelectProps = SelectDOMProps & SelectRootProps;

const ROOT_PROPS = [
  'autoComplete',
  'autoFocus',
  'defaultValue',
  'disabled',
  'form',
  'isOpen',
  'name',
  'onIsOpenChange',
  'onValueChange',
  'onItemSelected',
  'onListNavigate',
  'onKeyboardListNavigate',
  'readOnly',
  'required',
  'size',
  'value',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'tabIndex',
  'id',
];

const Select = forwardRef<typeof SELECT_DEFAULT_TAG, SelectProps, SelectStaticProps>(
  function Select(props, ref) {
    const { as = SELECT_DEFAULT_TAG, children, ...rest } = props;
    const rootProps = pick(rest, ROOT_PROPS);
    const buttonProps = omit(rest, ROOT_PROPS);
    return (
      <SelectRoot {...rootProps}>
        <SelectHiddenInput />
        <SelectButton as={as} ref={ref} {...buttonProps}>
          <SelectButtonLabel />
          <SelectButtonIcon />
        </SelectButton>
        <SelectPopover>
          <SelectList>{children}</SelectList>
        </SelectPopover>
      </SelectRoot>
    );
  }
);

/* ---------------------------------------------------------------------------------------------- */

Select.Button = SelectButton;
Select.ButtonLabel = SelectButtonLabel;
Select.ButtonIcon = SelectButtonIcon;
Select.HiddenInput = SelectHiddenInput;
Select.Option = SelectOption;
Select.List = SelectList;
Select.Popover = SelectPopover;

export { Select };
export type { SelectProps };

interface SelectStaticProps {
  Option: typeof SelectOption;
  Button: typeof SelectButton;
  ButtonLabel: typeof SelectButtonLabel;
  ButtonIcon: typeof SelectButtonIcon;
  HiddenInput: typeof SelectHiddenInput;
  List: typeof SelectList;
  Popover: typeof SelectPopover;
}
