// TODO: Not yet included is a way to manage the list items for keyboard navigation. Waiting for
//       Benoit's work on a collection API to integrate here.

import * as React from 'react';
import {
  getOwnerDocument,
  isFunction,
  makeId,
  DistributiveOmit,
  interopDataAttrObj,
  cssReset,
} from '@interop-ui/utils';
import { useMachine, StateMachine, createMachine } from '@interop-ui/react-use-machine';
import { findAll } from 'highlight-words-core';
import {
  composeEventHandlers,
  createContext,
  forwardRef,
  memo,
  useComposedRefs,
  useCallbackRef,
  useId,
} from '@interop-ui/react-utils';
import { Popover, PopoverProps } from '@interop-ui/react-popover';
import {
  createStateChart,
  ComboboxStateData,
  ComboboxEvents,
  ComboboxEvent,
  ComboboxStates,
} from '@interop-ui/primitive-combobox';
import kebabCase from 'lodash.kebabcase';

const DEBUG = __DEV__ ? true : false;
const UNGROUPED_OPTION_KEY = '_interop_ungrouped_option';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

const [ComboboxContext, useComboboxContext] = createContext<ComboboxContextValue>(
  'ComboboxContext',
  'Combobox'
);

/* -------------------------------------------------------------------------------------------------
 * Combobox
 * -----------------------------------------------------------------------------------------------*/

const COMBOBOX_DEFAULT_TAG = 'div';

type ComboboxDOMProps = React.ComponentPropsWithoutRef<typeof COMBOBOX_DEFAULT_TAG>;
type ComboboxOwnProps = {
  /**
   * Determines if the value in the input changes to reflect the highlighted
   * option as the user navigates the list using a with the keyboard.
   * @default true
   */
  autoCompleteOnHighlight?: boolean;
  children: React.ReactNode | ((props: any) => React.ReactNode);
  defaultValue?: string;
  onInputChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  onValueSelect?(value: string): void;
  /**
   * Whether or not the listbox should open when the input is focused
   * @default false
   * */
  openOnFocus?: boolean;
  /**
   * When `true` and the list is opened, if an option's value matches the value in the input, it
   * will automatically be highlighted and be the starting point for any keyboard navigation of the
   * list.
   * @default false
   */
  persistSelection?: boolean;
  /**
   * Deterines whether or not the current input value will be selected when the user clicks on the
   * input. This is helpful if the user is likely to delete or copy all of the text after making a
   * selection, similar to the behavior of the address bar in browsers. In most cases the user
   * probably wants to tweak the value like a normal input, so this should generally be omitted.
   * @default false
   */
  selectInputValueOnClick?: boolean;
  value?: string;
};
type ComboboxProps = ComboboxDOMProps & ComboboxOwnProps;

const Combobox = forwardRef<typeof COMBOBOX_DEFAULT_TAG, ComboboxProps, ComboboxStaticProps>(
  function Combobox(
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedBy,
      as: Comp = COMBOBOX_DEFAULT_TAG,
      autoCompleteOnHighlight = true,
      children,
      defaultValue,
      onInputChange,
      onValueSelect,
      openOnFocus = false,
      persistSelection = false,
      selectInputValueOnClick = false,
      value: controlledValue,
      ...props
    },
    forwardedRef
  ) {
    let inputRef = React.useRef<HTMLInputElement | null>(null);
    let popoverRef = React.useRef<HTMLElement | null>(null);
    let buttonRef = React.useRef<HTMLElement | null>(null);

    let { current: initialControlledValue } = React.useRef(controlledValue);
    let controlledValueChangedRef = React.useRef(false);
    useUpdateEffect(() => {
      controlledValueChangedRef.current = true;
    }, [controlledValue]);

    let isControlled = controlledValue != null;

    let [{ value, context: data }, send] = useMachine(
      () =>
        createMachine(
          createStateChart({
            value: isControlled ? controlledValue! : defaultValue || '',
          })
        ),
      { refs: { input: inputRef }, DEBUG }
    );

    // TODO: PR a fix in xstate/fsm types
    let state = value as ComboboxStates;

    let generatedId = makeId('combobox', useId());
    let comboboxId = props.id || generatedId;
    let listboxId = makeId('listbox', comboboxId);

    let handleValueChange = useCallbackRef(function handleValueChange(value: string) {
      if (value.trim() === '') {
        send(ComboboxEvents.Clear);
      } else {
        send({
          type: ComboboxEvents.Change,
          value,
          controlledValueChanged: controlledValueChangedRef.current,
          initialControlledValue,
        });
      }
    });

    // When controlled, we don't trigger handleValueChange as the user types.
    // Instead the developer controls it with the normal `onInputChange` prop
    let handleInputChange = useCallbackRef(
      composeEventHandlers(onInputChange, function handleInputChange(
        event: React.ChangeEvent<HTMLInputElement>
      ) {
        let { value } = event.target;
        if (!isControlled) {
          handleValueChange(value);
        }
      })
    );

    // TODO: This feels fragile and possibly wrong? Re-visit. Probably belongs in the state machine.
    let inputValue =
      autoCompleteOnHighlight &&
      (state === ComboboxStates.Navigating || state === ComboboxStates.Interacting)
        ? // When idle, we don't have a highlightedValue on ArrowUp/Down
          data.highlightedValue || controlledValue || data.value || ''
        : isControlled
        ? controlledValue!
        : data.value;

    let context: ComboboxContextValue = {
      ariaLabel,
      ariaLabelledby,
      ariaDescribedBy,
      autoCompleteOnHighlight,
      buttonRef,
      comboboxId,
      data,
      handleInputChange,
      inputRef,
      inputValue,
      isOpen: popoverIsExpanded(state),
      listboxId,
      onValueSelect: onValueSelect || noop,
      openOnFocus,
      persistSelection,
      popoverRef,
      selectInputValueOnClick,
      send,
      state,
    };

    React.useEffect(() => {
      // If they are controlling the value we still need to do our transitions,
      // so we have this derived state to emulate onChange of the input as we
      // receive new values.
      if (
        isControlled &&
        controlledValue !== value &&
        // https://github.com/reach/reach-ui/issues/481
        (controlledValue!.trim() === '' ? (value || '').trim() !== '' : true)
      ) {
        handleValueChange(controlledValue!);
      }
    }, [controlledValue, handleValueChange, isControlled, value]);

    return (
      <ComboboxContext.Provider value={context}>
        <Comp {...props} {...interopDataAttrObj('Combobox')} ref={forwardedRef}>
          {isFunction(children)
            ? children({ id: comboboxId, isOpen: popoverIsExpanded(state) })
            : children}
        </Comp>
      </ComboboxContext.Provider>
    );
  }
);

Combobox.displayName = 'Combobox';

/* -------------------------------------------------------------------------------------------------
 * ComboboxInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_DEFAULT_TAG = 'input';

type ComboboxInputDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof INPUT_DEFAULT_TAG>,
  'onChange' | 'value' | 'defaultValue'
>;
type ComboboxInputOwnProps = {};
type ComboboxInputProps = ComboboxInputDOMProps & ComboboxInputOwnProps;

const ComboboxInputImpl = forwardRef<typeof INPUT_DEFAULT_TAG, ComboboxInputProps>(
  function ComboboxInput(props, forwardedRef) {
    if (process.env.NODE_ENV === 'development') {
      if (typeof (props as any).onChange !== 'undefined') {
        // TODO: Dev warning
        console.warn('');
      }
      if (typeof (props as any).defaultValue !== 'undefined') {
        // TODO: Dev warning
        console.warn('');
      }
      if (typeof (props as any).value !== 'undefined') {
        // TODO: Dev warning
        console.warn('');
      }
    }

    let {
      as: Comp = INPUT_DEFAULT_TAG,

      onClick,
      onKeyDown,
      onBlur,
      onFocus,
      ...otherProps
    } = props;

    let {
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledby,
      comboboxId,
      data: { highlightedValue },
      handleInputChange,
      inputRef,
      inputValue,
      isOpen,
      listboxId,
      openOnFocus,
      selectInputValueOnClick,
      send,
    } = useComboboxContext('Combobox.Input');

    let ref = useComposedRefs(inputRef, forwardedRef);
    let handleKeyDown = useKeyDown('Combobox.Input');
    let handleBlur = useBlur('Combobox.Input');

    // Because we close the List on blur, we need to track if the blur is caused by clicking inside
    // the list, and if so, don't close the List.
    let selectOnClickRef = React.useRef(false);

    function handleFocus() {
      if (selectInputValueOnClick) {
        selectOnClickRef.current = true;
      }
      send({ type: ComboboxEvents.Focus, openOnFocus });
    }

    function handleClick() {
      if (selectOnClickRef.current) {
        selectOnClickRef.current = false;
        inputRef.current.select();
      }
    }

    return (
      <Comp
        ref={ref}
        {...interopDataAttrObj('ComboboxInput')}
        aria-activedescendant={
          highlightedValue ? makeItemId(comboboxId, kebabCase(highlightedValue)) : undefined
        }
        aria-autocomplete="both"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledby}
        aria-describedby={ariaDescribedBy || undefined}
        role="combobox"
        {...otherProps}
        onBlur={composeEventHandlers(onBlur, handleBlur)}
        onChange={handleInputChange}
        onClick={composeEventHandlers(onClick, handleClick)}
        onFocus={composeEventHandlers(onFocus, handleFocus)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        value={inputValue}
      />
    );
  }
);

ComboboxInputImpl.displayName = 'Combobox.Input';

const ComboboxInput = memo(ComboboxInputImpl);

/* -------------------------------------------------------------------------------------------------
 * ComboboxPopover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_DEFAULT_TAG = 'div';

type ComboboxPopoverDOMProps = React.ComponentPropsWithoutRef<typeof POPOVER_DEFAULT_TAG>;
type ComboboxPopoverOwnProps = Pick<
  PopoverProps,
  | 'shouldPortal'
  | 'positionOverride'
  | 'side'
  | 'sideOffset'
  | 'align'
  | 'alignOffset'
  | 'collisionTolerance'
> & {};
type ComboboxPopoverProps = ComboboxPopoverDOMProps & ComboboxPopoverOwnProps;

const ComboboxPopoverImpl = React.forwardRef<
  HTMLDivElement,
  ComboboxPopoverProps & Partial<PopoverProps>
>(function ComboboxPopover(props, forwardedRef: React.Ref<any>) {
  let { shouldPortal = true, onKeyDown, onBlur, ...otherProps } = props;
  let { popoverRef, inputRef, isOpen } = useComboboxContext('Combobox.Popover');
  let ref = useComposedRefs(popoverRef, forwardedRef);
  let handleKeyDown = useKeyDown('Combobox.Popover');
  let handleBlur = useBlur('Combobox.Popover');

  return (
    <Popover
      {...otherProps}
      {...interopDataAttrObj('ComboboxPopover')}
      ref={ref}
      isOpen={isOpen}
      onKeyDown={composeEventHandlers<any>(onKeyDown, handleKeyDown)}
      onBlur={composeEventHandlers<any>(onBlur, handleBlur)}
      hidden={!isOpen}
      tabIndex={-1}
      shouldPortal={shouldPortal}
      targetRef={inputRef}
      renderOnlyWhileOpen={false}
    />
  );
});

ComboboxPopoverImpl.displayName = 'Combobox.Popover';

const ComboboxPopover = React.memo(ComboboxPopoverImpl);

/* -------------------------------------------------------------------------------------------------
 * ComboboxList
 * -----------------------------------------------------------------------------------------------*/

const LIST_DEFAULT_TAG = 'div';
type ComboboxListDOMProps = React.ComponentPropsWithoutRef<typeof LIST_DEFAULT_TAG>;
type ComboboxListOwnProps = {};
type ComboboxListProps = ComboboxListDOMProps & ComboboxListOwnProps;

const ComboboxList = forwardRef<typeof LIST_DEFAULT_TAG, ComboboxListProps>(function ComboboxList(
  { as: Comp = LIST_DEFAULT_TAG, ...props },
  forwardedRef
) {
  let { listboxId } = useComboboxContext('ComboboxList');
  return (
    <Comp
      role="listbox"
      tabIndex={0}
      {...props}
      ref={forwardedRef}
      {...interopDataAttrObj('ComboboxList')}
      id={listboxId}
    />
  );
});

ComboboxList.displayName = 'Combobox.List';

/* -------------------------------------------------------------------------------------------------
 * ComboboxOption
 * -----------------------------------------------------------------------------------------------*/

const [OptionContext, useOptionContext] = createContext<ComboboxOptionContextValue>(
  'OptionContext',
  'Combobox.Option'
);

const OPTION_DEFAULT_TAG = 'div';
type ComboboxOptionDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof OPTION_DEFAULT_TAG>,
  'value' | 'onSelect'
>;
type ComboboxOptionOwnProps = {
  /**
   * Optional. If omitted, the `value` will be used as the children. But if you need to control a
   * bit more, you can use any children you want. Make sure to render a `ComboboxOptionText` as well
   * so that the value is still displayed with the text highlighting on the matched portions.
   */
  children?: React.ReactNode;
  /**
   * The value to match against when suggesting.
   */
  value: string;
  disabled?: boolean;
};
type ComboboxOptionProps = ComboboxOptionDOMProps & ComboboxOptionOwnProps;

const ComboboxOption = forwardRef<typeof OPTION_DEFAULT_TAG, ComboboxOptionProps>(
  function ComboboxOption(
    { as: Comp = OPTION_DEFAULT_TAG, children, value, onClick, ...props },
    forwardedRef: React.Ref<any>
  ) {
    let {
      comboboxId,
      onValueSelect,
      data: { highlightedValue },
      send,
    } = useComboboxContext('Combobox.Option');

    let ownRef = React.useRef<HTMLElement | null>(null);
    let ref = useComposedRefs(forwardedRef, ownRef);

    let groupLabel = React.useContext(OptionGroupContext)?.label;

    // TODO: Fix it
    let index = 0;

    let isActive = highlightedValue === value;

    function handleClick() {
      onValueSelect && onValueSelect(value);
      send({ type: ComboboxEvents.SelectWithClick, value });
    }

    return (
      <OptionContext.Provider value={{ value, index }}>
        <Comp
          aria-selected={isActive}
          role="option"
          {...props}
          {...interopDataAttrObj('ComboboxOption')}
          ref={ref}
          id={makeItemId(comboboxId, kebabCase(value))}
          data-highlighted={isActive ? '' : undefined}
          data-group={groupLabel || undefined}
          // Without this the menu will close from `onBlur`, but with it the
          // element can be `document.activeElement` and then our focus checks in
          // onBlur will work as intended
          tabIndex={-1}
          onClick={composeEventHandlers(onClick, handleClick)}
          children={children || <ComboboxOptionText />}
        />
      </OptionContext.Provider>
    );
  }
);

ComboboxOption.displayName = 'Combobox.Option';

/* -------------------------------------------------------------------------------------------------
 * ComboboxOptionText
 * -----------------------------------------------------------------------------------------------*/

const TEXT_DEFAULT_TAG = 'span';

type ComboboxOptionTextDOMProps = React.ComponentPropsWithoutRef<typeof TEXT_DEFAULT_TAG>;
type ComboboxOptionTextOwnProps = {};
type ComboboxOptionTextProps = ComboboxOptionTextOwnProps & ComboboxOptionTextDOMProps;

const ComboboxOptionText = forwardRef<typeof TEXT_DEFAULT_TAG, ComboboxOptionTextProps>(
  function ComboboxOptionText(props, forwardedRef) {
    let { as: Comp = TEXT_DEFAULT_TAG, ...textProps } = props;
    let { value } = useOptionContext('Combobox.OptionText');
    let {
      data: { value: contextValue },
    } = useComboboxContext('Combobox.OptionText');

    let results = React.useMemo(
      () =>
        findAll({
          searchWords: escapeRegexp(contextValue || '').split(/\s+/),
          textToHighlight: value,
        }),
      [contextValue, value]
    );

    return (
      <Comp ref={forwardedRef} {...interopDataAttrObj('ComboboxOptionText')} {...textProps}>
        {results.length
          ? results.map((result, index) => {
              let str = value.slice(result.start, result.end);
              return (
                <span
                  key={index}
                  data-user-value={result.highlight ? true : undefined}
                  data-suggested-value={result.highlight ? undefined : true}
                >
                  {str}
                </span>
              );
            })
          : value}
      </Comp>
    );
  }
);

ComboboxOptionText.displayName = 'Combobox.OptionText';

/* -------------------------------------------------------------------------------------------------
 * ComboboxGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_DEFAULT_TAG = 'div';

type ComboboxGroupDOMProps = React.ComponentPropsWithoutRef<typeof GROUP_DEFAULT_TAG>;
type ComboboxGroupOwnProps = { label: string };
type ComboboxGroupProps = ComboboxGroupDOMProps & ComboboxGroupOwnProps;

type ComboboxGroupType = {
  label: string;
  index: number;
};

interface ComboboxGroupContextValue {
  label?: string;
}

const OptionGroupContext = React.createContext<ComboboxGroupContextValue | undefined>(undefined);
OptionGroupContext.displayName = 'OptionGroupContext';

const ComboboxGroup = forwardRef<typeof GROUP_DEFAULT_TAG, ComboboxGroupProps>(
  function ComboboxGroup(props, forwardedRef) {
    let { label, children, ...rest } = props;
    // TODO: Role `none` might not work here, I think it might hide nested elements from the
    // accessibility tree. May need role="group". Needs SR testing.
    return label === UNGROUPED_OPTION_KEY ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <OptionGroupContext.Provider value={{ label }}>
        <div {...interopDataAttrObj('ComboboxGroup')} {...rest} ref={forwardedRef} role="none">
          {children}
        </div>
      </OptionGroupContext.Provider>
    );
  }
);

ComboboxGroup.displayName = 'Combobox.Group';

/* -------------------------------------------------------------------------------------------------
 * ComboboxButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_DEFAULT_TAG = 'button';

type ComboboxButtonDOMProps = React.ComponentPropsWithoutRef<typeof BUTTON_DEFAULT_TAG>;
type ComboboxButtonOwnProps = {};
type ComboboxButtonProps = ComboboxButtonOwnProps & ComboboxButtonDOMProps;

const ComboboxButton = forwardRef<typeof BUTTON_DEFAULT_TAG, ComboboxButtonProps>(
  function ComboboxButton(
    { as: Comp = BUTTON_DEFAULT_TAG, onClick, onKeyDown, onMouseDown, onTouchStart, ...props },
    forwardedRef
  ) {
    let { send, buttonRef, listboxId, isOpen, persistSelection, state } = useComboboxContext(
      'Combobox.Button'
    );
    let ref = useComposedRefs(buttonRef, forwardedRef);

    // When a user starts clicking the button, the blur event fires and closes
    // the popover if it's open. When a click finishes, the next click event
    // fires then reopens the menu. So we'll track the click in this pointer
    // and only fire the ClickButton event when the click is intended.
    let clickStarted = React.useRef(false);

    function handleMouseDown() {
      if (state !== ComboboxStates.Idle) {
        clickStarted.current = true;
      }
    }

    let handleKeyDown = useKeyDown('Combobox.Button');

    function handleClick() {
      if (!clickStarted.current) {
        send({
          type: ComboboxEvents.ClickButton,
          persistSelection,
        });
      }
      clickStarted.current = false;
    }

    React.useEffect(() => {
      window.addEventListener('mouseup', handler);
      window.addEventListener('touchend', handler);
      function handler(event: any) {
        if (event.target !== buttonRef.current && !buttonRef.current?.contains(event.target)) {
          clickStarted.current = false;
        }
      }
      return () => {
        window.removeEventListener('mouseup', handler);
        window.removeEventListener('touchend', handler);
      };
    }, [buttonRef]);

    return (
      <Comp
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...props}
        {...interopDataAttrObj('ComboboxButton')}
        ref={ref}
        onClick={composeEventHandlers(onClick, handleClick)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        onMouseDown={composeEventHandlers(onMouseDown, handleMouseDown)}
        onTouchStart={composeEventHandlers(onTouchStart, handleMouseDown)}
      />
    );
  }
);

ComboboxButton.displayName = 'Combobox.Button';

/* ---------------------------------------------------------------------------------------------- */

interface ComboboxStaticProps {
  Input: typeof ComboboxInput;
  Popover: typeof ComboboxPopover;
  List: typeof ComboboxList;
  Option: typeof ComboboxOption;
  OptionText: typeof ComboboxOptionText;
  Group: typeof ComboboxGroup;
  Button: typeof ComboboxButton;
}

Combobox.Input = ComboboxInput;
Combobox.Popover = ComboboxPopover;
Combobox.List = ComboboxList;
Combobox.Option = ComboboxOption;
Combobox.OptionText = ComboboxOptionText;
Combobox.Group = ComboboxGroup;
Combobox.Button = ComboboxButton;

const styles = {
  combobox: {
    ...cssReset(COMBOBOX_DEFAULT_TAG),
    position: 'relative',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    ...cssReset(INPUT_DEFAULT_TAG),
  },
  popover: {
    ...cssReset(POPOVER_DEFAULT_TAG),
    position: 'absolute',
  },
  list: {
    ...cssReset(LIST_DEFAULT_TAG),
  },
  option: {
    ...cssReset(OPTION_DEFAULT_TAG),
  },
  optionText: {
    ...cssReset(TEXT_DEFAULT_TAG),
  },
  group: {
    ...cssReset(GROUP_DEFAULT_TAG),
  },
  button: {
    ...cssReset(BUTTON_DEFAULT_TAG),
  },
};

export { Combobox, styles };
export type {
  ComboboxProps,
  ComboboxInputProps,
  ComboboxPopoverProps,
  ComboboxListProps,
  ComboboxOptionProps,
  ComboboxOptionTextProps,
  ComboboxGroupProps,
  ComboboxButtonProps,
};

/* ---------------------------------------------------------------------------------------------- */

function useKeyDown(componentName?: string) {
  let {
    data: { highlightedValue },
    onValueSelect,
    state,
    send,
    autoCompleteOnHighlight,
    persistSelection,
  } = useComboboxContext(componentName || 'useKeyDown');

  // TODO: Fix it
  let options = [] as any[];

  return function handleKeyDown(event: React.KeyboardEvent) {
    let index = options.findIndex(({ value }) => value === highlightedValue);

    function getNextOption() {
      let atBottom = index === options.length - 1;
      if (atBottom) {
        if (autoCompleteOnHighlight) {
          // Go back to the value the user has typed because we are
          // autocompleting and they need to be able to get back to what
          // they had typed w/o having to backspace out.
          return null;
        } else {
          // cycle through
          return getFirstOption();
        }
      } else {
        // Go to the next item in the list
        return options[(index + 1) % options.length];
      }
    }

    function getPreviousOption() {
      let atTop = index === 0;
      if (atTop) {
        if (autoCompleteOnHighlight) {
          // Go back to the value the user has typed because we are
          // autocompleting and they need to be able to get back to what
          // they had typed w/o having to backspace out.
          return null;
        } else {
          // cycle through
          return getLastOption();
        }
      } else if (index === -1) {
        // displaying the user's value, so go select the last one
        return getLastOption();
      } else {
        // normal case, select previous
        return options[(index - 1 + options.length) % options.length];
      }
    }

    function getFirstOption() {
      return options[0];
    }

    function getLastOption() {
      return options[options.length - 1];
    }

    switch (event.key) {
      case 'ArrowDown':
        // Don't scroll the page
        event.preventDefault();
        if (!options || !options.length) {
          return;
        }

        send({
          type: ComboboxEvents.Navigate,
          value: getNextOption()?.value || null,
          persistSelection,
        });
        break;

      // A lot of duplicate code with ArrowDown up next, I'm already over it.
      case 'ArrowUp':
        // Don't scroll the page
        event.preventDefault();
        if (!options || options.length === 0) {
          return;
        }

        send({
          type: ComboboxEvents.Navigate,
          value: getPreviousOption()?.value || null,
          persistSelection,
        });
        break;

      case 'Home':
      case 'PageUp':
        // Don't scroll the page
        event.preventDefault();
        if (!options || options.length === 0) {
          return;
        }

        send({
          type: ComboboxEvents.Navigate,
          value: getFirstOption().value,
        });
        break;

      case 'End':
      case 'PageDown':
        // Don't scroll the page
        event.preventDefault();
        if (!options || options.length === 0) {
          return;
        }

        send({
          type: ComboboxEvents.Navigate,
          value: getLastOption().value,
        });
        break;

      case 'Escape':
        send(ComboboxEvents.Escape);
        break;
      case 'Enter':
        send({
          type: ComboboxEvents.SelectWithKeyboard,
          event: event.nativeEvent,
          onValueSelect,
          highlightedValue,
        });
        break;
    }
  };
}

function useBlur(componentName?: string) {
  let { state, send, popoverRef, inputRef, buttonRef } = useComboboxContext(
    componentName || 'useBlur'
  );

  return function handleBlur() {
    let ownerDocument = getOwnerDocument(inputRef.current) || document;
    requestAnimationFrame(() => {
      // we on want to close only if focus propss outside the combobox
      if (
        ownerDocument.activeElement !== inputRef.current &&
        ownerDocument.activeElement !== buttonRef.current &&
        popoverRef.current
      ) {
        if (popoverRef.current.contains(ownerDocument.activeElement)) {
          // focus landed inside the combobox, keep it open
          if (state !== ComboboxStates.Interacting) {
            send(ComboboxEvents.Interact);
          }
        } else {
          // focus landed outside the combobox, close it.
          send(ComboboxEvents.Blur);
        }
      }
    });
  };
}

type ComboboxDescendant = {
  value: string;
};

interface ComboboxOptionContextValue {
  value: string;
  index: number;
}

interface ComboboxContextValue {
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedBy?: string;
  autoCompleteOnHighlight: boolean;
  buttonRef: React.MutableRefObject<any>;
  comboboxId: string;
  data: ComboboxStateData;
  handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void;
  inputRef: React.MutableRefObject<any>;
  inputValue: string;
  isOpen: boolean;
  listboxId: string;
  onInputChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  onValueSelect(value?: string): any;
  openOnFocus: boolean;
  persistSelection: boolean;
  popoverRef: React.MutableRefObject<any>;
  selectInputValueOnClick: boolean;
  send: StateMachine.Service<ComboboxStateData, DistributiveOmit<ComboboxEvent, 'refs'>>['send'];
  state: ComboboxStates;
}

/**
 * Call an effect after a component update, skipping the initial mount.
 *
 * @param effect Effect to call
 * @param deps Effect dependency list
 */
function useUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  let mounted = React.useRef(false);
  React.useEffect(() => {
    if (mounted.current) {
      effect();
    } else {
      mounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function noop() {}

function makeItemId(baseId: string, value: string) {
  return makeId(`${baseId}-option`, value);
}

/**
 * Escape regexp special characters in `str`
 *
 * @see https://github.com/component/escape-regexp/blob/5ce923c1510c9802b3da972c90b6861dd2829b6b/index.js
 * @param str
 */
function escapeRegexp(str: string) {
  return String(str).replace(/([.*+?=^!:${}()|[\]/\\])/g, '\\$1');
}

function popoverIsExpanded(state: ComboboxStates) {
  return [
    ComboboxStates.Suggesting,
    ComboboxStates.Navigating,
    ComboboxStates.Interacting,
  ].includes(state);
}
