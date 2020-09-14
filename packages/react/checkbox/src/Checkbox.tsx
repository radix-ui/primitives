/**
 * Portions of this code were copied and adapted from `react-spectrum`. The original license for
 * that project can be found in the root of the `react-spectrum` repo
 * @see https://github.com/adobe/react-spectrum/blob/main/LICENSE
 */

import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  memo,
  useComposedRefs,
  useControlledState,
} from '@interop-ui/react-utils';
import { VisuallyHidden, styles as visuallyHiddenStyles } from '@interop-ui/react-visually-hidden';
import { cssReset, isFunction, warning } from '@interop-ui/utils';

// These props will be passed to the top-level root rather than the input when using the composed
// API so that we can share data via context.
const inputPropsForRoot = [
  'autoComplete',
  'autoFocus',
  'checked',
  'defaultChecked',
  'disabled',
  'form',
  'name',
  'readOnly',
  'required',
  'value',
] as const;

type CheckboxInputAttributes = typeof inputPropsForRoot[number];

const CHECKBOX_NAME = 'Checkbox';
type CheckboxContextValue = {
  ariaControls: AriaToggleProps['aria-controls'];
  ariaErrormessage: AriaToggleProps['aria-errormessage'];
  checked: boolean;
  disabled: boolean;
  form?: string;
  id?: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  isFocused: boolean;
  isFocusVisible: boolean;
  isIndeterminate: boolean;
  name?: string;
  readOnly?: boolean;
  required?: boolean;
  setSelected: (checked: boolean) => void;
  toggle: () => void;
  validationState: CheckboxValidationState;
  value?: string;
};

type HiddenInputContextValue = {
  focusProps: React.InputHTMLAttributes<HTMLInputElement>;
};

const [CheckboxContext, useCheckboxContext] = createContext<CheckboxContextValue>(
  'CheckboxContext',
  CHECKBOX_NAME
);
CheckboxContext.displayName = 'CheckboxContext';

const [HiddenInputContext, useHiddenInputContext] = createContext<HiddenInputContextValue>(
  'HiddenInputContext',
  CHECKBOX_NAME
);

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

type CheckboxRenderProps = {
  checked: boolean;
  inputRef: React.RefObject<HTMLInputElement | null | undefined>;
  isFocused: boolean;
  isFocusVisible: boolean;
  isIndeterminate: boolean;
};

type CheckboxOwnProps = Omit<
  Pick<React.ComponentPropsWithoutRef<'input'>, CheckboxInputAttributes>,
  'value'
> &
  AriaToggleProps & {
    isIndeterminate?: boolean;
    children?: React.ReactElement | ((props: CheckboxRenderProps) => React.ReactElement);
    id?: string;
    onChange?(checked: boolean): void;
    renderHiddenInput?(props: CheckboxRenderProps): React.ReactElement;
    validationState?: CheckboxValidationState;
    value?: string;
  };

type CheckboxProps = CheckboxOwnProps;

const Checkbox: React.FC<CheckboxProps> = function Checkbox(props) {
  const {
    children,
    disabled = false,
    form,
    id,
    isIndeterminate = false,
    name,
    onChange,
    readOnly,
    required,
    validationState = 'valid',
    value,
  } = props;

  // have to provide an empty function so useControlledState doesn't throw a fit
  // can't use useControlledState's prop calling because we need the event object from the change
  const [_checked, _setSelected] = useControlledState({
    prop: props.checked,
    defaultProp: props.defaultChecked,
  });

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const checked = Boolean(_checked);

  // Persistant ref values
  const readOnlyRef = React.useRef(readOnly);
  const onChangeRef = React.useRef(onChange);
  const checkedRef = React.useRef(checked);
  React.useEffect(() => {
    readOnlyRef.current = readOnly;
    onChangeRef.current = onChange;
    checkedRef.current = checked;
  });

  const setSelected = React.useCallback(
    function setSelected(value: boolean) {
      if (!readOnlyRef.current) {
        _setSelected(value);
        if (onChangeRef.current) {
          onChangeRef.current(value);
        }
      }
    },
    [_setSelected]
  );

  const toggle = React.useCallback(
    function toggle() {
      setSelected(!checkedRef.current);
    },
    [setSelected]
  );

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  });

  // Adapted from @react-aria, very useful!
  let { isFocused, isFocusVisible, focusProps } = useFocusRing();

  let hiddenInput = <CheckboxHiddenInput />;
  if (isFunction(props.renderHiddenInput)) {
    hiddenInput = props.renderHiddenInput({
      checked,
      inputRef,
      isFocused,
      isFocusVisible,
      isIndeterminate,
    });
  }

  const ariaControls = props['aria-controls'];
  const ariaErrormessage = props['aria-errormessage'];

  const context: CheckboxContextValue = React.useMemo(
    () => ({
      ariaControls,
      ariaErrormessage,
      checked,
      disabled,
      form,
      id,
      inputRef,
      isFocused,
      isFocusVisible,
      isIndeterminate,
      name,
      readOnly,
      required,
      setSelected,
      toggle,
      validationState,
      value,
    }),
    [
      ariaControls,
      ariaErrormessage,
      checked,
      disabled,
      form,
      id,
      isFocused,
      isFocusVisible,
      isIndeterminate,
      name,
      readOnly,
      required,
      setSelected,
      toggle,
      validationState,
      value,
    ]
  );

  return (
    <CheckboxContext.Provider value={context}>
      <VisuallyHidden style={visuallyHiddenStyles.root}>
        <HiddenInputContext.Provider value={{ focusProps }}>
          {hiddenInput}
        </HiddenInputContext.Provider>
      </VisuallyHidden>
      {isFunction(children)
        ? children({
            checked,
            inputRef,
            isFocused,
            isFocusVisible,
            isIndeterminate,
          })
        : children}
    </CheckboxContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * CheckboxHiddenInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_NAME = 'Checkbox.HiddenInput';
const INPUT_DEFAULT_TAG = 'input';

type CheckboxInputDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof INPUT_DEFAULT_TAG>,
  CheckboxInputAttributes
>;
type CheckboxInputOwnProps = {};
type CheckboxHiddenInputProps = CheckboxInputDOMProps & CheckboxInputOwnProps;

const CheckboxHiddenInputImpl = forwardRef<typeof INPUT_DEFAULT_TAG, CheckboxHiddenInputProps>(
  function CheckboxHiddenInput(props, forwardedRef) {
    const { as: Comp = INPUT_DEFAULT_TAG, children, ...checkboxInputProps } = props;

    const { focusProps } = useHiddenInputContext(INPUT_NAME);
    const {
      ariaControls,
      ariaErrormessage,
      checked,
      disabled,
      form,
      inputRef,
      id,
      isIndeterminate,
      setSelected,
      validationState,
      name,
      readOnly,
      required,
      value,
    } = useCheckboxContext(INPUT_NAME);
    const ref = useComposedRefs(forwardedRef, inputRef);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      event.stopPropagation();
      setSelected(event.target.checked);
    }

    React.useEffect(() => {
      for (let prop of inputPropsForRoot) {
        warning(
          !Object.hasOwnProperty.call(checkboxInputProps, prop),
          `The ${prop} prop was passed to the ${INPUT_NAME} component. This was likely a mistake. Instead, pass ${prop} to Checkbox.Root instead so that its data is available to the entire Checkbox component.`
        );
      }
      warning(
        !props.type,
        `The \`type\` prop was passed to the ${INPUT_NAME} component. The input type attribute for ${INPUT_NAME} is always "checkbox". You should remove the \`type\` prop to dismiss this error.`
      );
    });

    return (
      <Comp
        {...interopDataAttrObj('hiddenInput')}
        ref={ref}
        id={id}
        aria-checked={isIndeterminate ? ('mixed' as const) : checked}
        aria-controls={ariaControls}
        aria-errormessage={ariaErrormessage}
        aria-invalid={validationState === 'invalid' || undefined}
        {...checkboxInputProps}
        checked={checked}
        disabled={disabled}
        form={form}
        name={name}
        readOnly={readOnly}
        required={required}
        value={value}
        {...focusProps}
        type="checkbox"
        onChange={composeEventHandlers(props.onChange, handleChange)}
        onFocus={composeEventHandlers(props.onFocus, focusProps.onFocus)}
        onBlur={composeEventHandlers(props.onBlur, focusProps.onBlur)}
        tabIndex={props.disabled ? -1 : props.tabIndex}
      />
    );
  }
);
const CheckboxHiddenInput = memo(CheckboxHiddenInputImpl);

/* -------------------------------------------------------------------------------------------------
 * CheckboxBox
 * -----------------------------------------------------------------------------------------------*/

const BOX_NAME = 'Checkbox.Box';
const BOX_DEFAULT_TAG = 'span';

type CheckboxBoxDOMProps = React.ComponentPropsWithoutRef<typeof BOX_DEFAULT_TAG>;
type CheckboxBoxOwnProps = {};
type CheckboxBoxProps = CheckboxBoxDOMProps & CheckboxBoxOwnProps;

const CheckboxBoxImpl = forwardRef<typeof BOX_DEFAULT_TAG, CheckboxBoxProps>(function CheckboxBox(
  props,
  forwardedRef
) {
  const { as: Comp = BOX_DEFAULT_TAG, ...checkboxBoxProps } = props;
  const {
    checked,
    disabled,
    isIndeterminate,
    isFocused,
    isFocusVisible,
    toggle,
    inputRef,
    validationState,
  } = useCheckboxContext(BOX_NAME);

  function handleClick(event: React.MouseEvent) {
    // If the user manages to click the hidden input directly, or if the checkbox is nested inside
    // of a label, an onChange event for the input is triggered and we don't need to do anything
    // special here. Otherwise, we need to toggle the checkbox manually.
    const label = event.target ? elementClosest(event.target as HTMLElement, 'label') : null;
    if (!disabled && event.target !== inputRef.current && !label) {
      toggle();
    }
  }

  function handlePointerDown(event: React.PointerEvent) {
    if (event.button !== 0) {
      return;
    }

    if (!disabled) {
      // Focus the input on pointer down. Safari nor Firefox do this by default, but Chrome + Edge
      // do. Particularly useful for iOS users.
      event.preventDefault();
      inputRef.current?.focus();
    }
  }

  return (
    <Comp
      {...interopDataAttrObj('box')}
      data-focus-visible={isFocusVisible ? '' : undefined}
      data-focused={isFocused ? '' : undefined}
      data-indeterminate={isIndeterminate ? '' : undefined}
      data-state={checked ? 'checked' : 'unchecked'}
      data-validation-state={validationState}
      {...checkboxBoxProps}
      onClick={composeEventHandlers(props.onClick, handleClick)}
      onPointerDown={composeEventHandlers(props.onPointerDown, handlePointerDown)}
      ref={forwardedRef}
    />
  );
});
const CheckboxBox = memo(CheckboxBoxImpl);

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'Checkbox.Indicator';
const INDICATOR_DEFAULT_TAG = 'span';

type CheckboxIndicatorDOMProps = React.ComponentPropsWithoutRef<typeof INDICATOR_DEFAULT_TAG>;
type CheckboxIndicatorOwnProps = {
  children?:
    | React.ReactElement
    | ((props: { checked: boolean; isIndeterminate: boolean }) => React.ReactElement);
};
type CheckboxIndicatorProps = CheckboxIndicatorDOMProps & CheckboxIndicatorOwnProps;

const CheckboxIndicator = forwardRef<typeof INDICATOR_DEFAULT_TAG, CheckboxIndicatorProps>(
  function CheckboxIndicator(props, forwardedRef) {
    let { as: Comp = INDICATOR_DEFAULT_TAG, children, ...checkboxBoxProps } = props;
    let { checked, isIndeterminate } = useCheckboxContext(INDICATOR_NAME);
    return checked || isIndeterminate ? (
      <Comp
        {...interopDataAttrObj('indicator')}
        data-state={checked ? 'checked' : 'unchecked'}
        data-indeterminate={isIndeterminate ? '' : undefined}
        ref={forwardedRef}
        {...checkboxBoxProps}
      >
        {isFunction(children) ? children({ checked, isIndeterminate }) : children}
      </Comp>
    ) : null;
  }
);

/* ---------------------------------------------------------------------------------------------- */

const _Checkbox = Object.assign(Checkbox, {
  HiddenInput: CheckboxHiddenInput,
  Box: CheckboxBox,
  Indicator: CheckboxIndicator,
});

_Checkbox.displayName = CHECKBOX_NAME;
_Checkbox.HiddenInput.displayName = INPUT_NAME;
_Checkbox.Box.displayName = BOX_NAME;
_Checkbox.Indicator.displayName = INDICATOR_NAME;

const [styles, interopDataAttrObj] = createStyleObj(CHECKBOX_NAME, {
  root: {},
  box: {
    ...cssReset(BOX_DEFAULT_TAG),
    display: 'block',
    position: 'relative',
    userSelect: 'none',
    zIndex: 0,
  },
  hiddenInput: {},
  indicator: {
    ...cssReset(INDICATOR_DEFAULT_TAG),
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
  },
});

export { _Checkbox as Checkbox, styles };

/* -------------------------------------------------------------------------------------------------
 * useFocusWithin
 * -----------------------------------------------------------------------------------------------*/

/**
 * Handles focus events for the target and its descendants.
 *
 * Adapted from @react-aria/interactions/useFocusWithin.
 *
 * @see https://react-spectrum.adobe.com/react-aria/useFocusWithin.html
 */
function useFocusWithin<T extends Element = Element>(
  props: UseFocusWithinProps<T>
): UseFocusWithinResult<T> {
  let state = React.useRef({
    isFocusWithin: false,
  }).current;

  if (props.disabled) {
    return { focusWithinProps: {} };
  }

  function handleFocus(event: React.FocusEvent<T>) {
    if (!state.isFocusWithin) {
      if (props.onFocusWithin) {
        props.onFocusWithin(event);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(true);
      }

      state.isFocusWithin = true;
    }
  }

  function handleBlur(event: React.FocusEvent<T>) {
    // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
    // when moving focus inside the element. Only trigger if the currentTarget doesn't
    // include the relatedTarget (where focus is moving).
    if (state.isFocusWithin && !event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      if (props.onBlurWithin) {
        props.onBlurWithin(event);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(false);
      }

      state.isFocusWithin = false;
    }
  }

  return {
    focusWithinProps: {
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}

interface UseFocusWithinProps<T extends Element = Element> {
  onFocus?: React.HTMLAttributes<T>['onFocus'];
  onBlur?: React.HTMLAttributes<T>['onBlur'];
  /** Whether the focus within events should be disabled. */
  disabled?: boolean;
  /** Handler that is called when the target element or a descendant receives focus. */
  onFocusWithin?: (e: React.FocusEvent<T>) => void;
  /** Handler that is called when the target element and all descendants lose focus. */
  onBlurWithin?: (e: React.FocusEvent<T>) => void;
  /** Handler that is called when the the focus within state changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

interface UseFocusWithinResult<T extends Element = Element> {
  /** Props to spread onto the target element. */
  focusWithinProps: React.HTMLAttributes<T>;
}

/* -------------------------------------------------------------------------------------------------
 * useFocusRing
 * -----------------------------------------------------------------------------------------------*/

/**
 * Determines whether a focus ring should be shown to indicate keyboard focus. Focus rings are
 * visible only when the user is interacting with a keyboard, not with a mouse, touch, or other
 * input methods.
 */
function useFocusRing<T extends Element = Element>(
  props: UseFocusRingProps = {}
): UseFocusRingResult<T> {
  let { within } = props;
  let [isFocused, setFocused] = React.useState(false);
  let [isFocusWithin, setFocusWithin] = React.useState(false);
  let { isFocusVisible } = useFocusVisible(props);
  let { focusProps } = useFocusImmediate<T>({
    disabled: within,
    onFocusChange: setFocused,
  });
  let { focusWithinProps } = useFocusWithin<T>({
    disabled: !within,
    onFocusWithinChange: setFocusWithin,
  });

  return {
    isFocused: within ? isFocusWithin : isFocused,
    isFocusVisible: (within ? isFocusWithin : isFocused) && isFocusVisible,
    focusProps: within ? focusWithinProps : focusProps,
  };
}

interface UseFocusRingProps {
  /**
   * Whether or not to show the focus ring when something inside the container element has focus
   * (true), or only if the container itself has focus (false).
   * @default 'false'
   */
  within?: boolean;

  /** Whether or not the element is a text input. */
  isTextInput?: boolean;

  /** Whether or not the element will be auto focused. */
  autoFocus?: boolean;
}

interface UseFocusRingResult<T extends Element = Element> {
  /** Whether the element is currently focused. */
  isFocused: boolean;

  /** Whether keyboard focus should be visible. */
  isFocusVisible: boolean;

  /** Props to apply to the container element with the focus ring. */
  focusProps: React.HTMLAttributes<T>;
}

/* -------------------------------------------------------------------------------------------------
 * useFocusVisible
 * -----------------------------------------------------------------------------------------------*/

/**
 * Manages focus visible state for the page, and subscribes individual components for updates.
 *
 * Adapted from @react-aria/interactions/useFocusVisible
 *
 * @see https://react-spectrum.adobe.com/react-aria/useFocusVisible.html
 */
function useFocusVisible(props: UseFocusVisibleProps = {}): UseFocusVisibleResult {
  setupGlobalFocusEvents();

  let { isTextInput, autoFocus } = props;
  let [isFocusVisibleState, setFocusVisible] = React.useState(autoFocus || isFocusVisible());
  React.useEffect(() => {
    let handler = (modality: Modality, e: HandlerEvent) => {
      // If this is a text input component, don't update the focus visible style when
      // typing except for when the Tab and Escape keys are pressed.
      if (
        isTextInput &&
        modality === 'keyboard' &&
        e instanceof KeyboardEvent &&
        !(FOCUS_VISIBLE_INPUT_KEYS as any)[e.key]
      ) {
        return;
      }

      setFocusVisible(isFocusVisible());
    };

    changeHandlers.add(handler);
    return () => {
      changeHandlers.delete(handler);
    };
  }, [isTextInput]);

  return { isFocusVisible: isFocusVisibleState };
}

type Modality = 'keyboard' | 'pointer' | 'virtual';
type HandlerEvent = PointerEvent | MouseEvent | KeyboardEvent | FocusEvent;
type Handler = (modality: Modality, e: HandlerEvent) => void;
interface UseFocusVisibleProps {
  /** Whether the element is a text input. */
  isTextInput?: boolean;
  /** Whether the element will be auto focused. */
  autoFocus?: boolean;
}

interface UseFocusVisibleResult {
  /** Whether keyboard focus is visible globally. */
  isFocusVisible: boolean;
}

let currentModality: Modality | null = null;
let changeHandlers = new Set<Handler>();
let hasSetupGlobalListeners = false;
let hasEventBeforeFocus = false;

const IS_MAC =
  typeof window !== 'undefined' && window.navigator != null
    ? /^Mac/.test(window.navigator.platform)
    : false;

// Only Tab or Esc keys will make focus visible on text input elements
const FOCUS_VISIBLE_INPUT_KEYS = {
  Tab: true,
  Escape: true,
};

function triggerChangeHandlers(modality: Modality, e: HandlerEvent) {
  for (let handler of changeHandlers) {
    handler(modality, e);
  }
}

/**
 * Helper function to determine if a KeyboardEvent is unmodified and could make keyboard focus
 * styles visible.
 */
function isValidKey(event: React.KeyboardEvent | KeyboardEvent) {
  return !(event.metaKey || (!IS_MAC && event.altKey) || event.ctrlKey);
}

function handleKeyboardEvent(event: KeyboardEvent) {
  hasEventBeforeFocus = true;
  if (isValidKey(event)) {
    currentModality = 'keyboard';
    triggerChangeHandlers('keyboard', event);
  }
}

function handlePointerEvent(event: PointerEvent | MouseEvent) {
  currentModality = 'pointer';
  if (event.type === 'mousedown' || event.type === 'pointerdown') {
    hasEventBeforeFocus = true;
    triggerChangeHandlers('pointer', event);
  }
}

function handleClickEvent(event: MouseEvent) {
  if (isVirtualClick(event)) {
    hasEventBeforeFocus = true;
    currentModality = 'virtual';
  }
}

function handleFocusEvent(event: FocusEvent) {
  // Firefox fires two extra focus events when the user first clicks into an iframe:
  // first on the window, then on the document. We ignore these events so they don't
  // cause keyboard focus rings to appear.
  if (event.target === window || event.target === document) {
    return;
  }

  // If a focus event occurs without a preceding keyboard or pointer event, switch to keyboard modality.
  // This occurs, for example, when navigating a form with the next/previous buttons on iOS.
  if (!hasEventBeforeFocus) {
    currentModality = 'keyboard';
    triggerChangeHandlers('keyboard', event);
  }

  hasEventBeforeFocus = false;
}

function handleWindowBlur() {
  // When the window is blurred, reset state. This is necessary when tabbing out of the window,
  // for example, since a subsequent focus event won't be fired.
  hasEventBeforeFocus = false;
}

/**
 * Setup global event listeners to control when keyboard focus style should be visible.
 */
function setupGlobalFocusEvents() {
  if (typeof window === 'undefined' || hasSetupGlobalListeners) {
    return;
  }

  // Programmatic focus() calls shouldn't affect the current input modality.
  // However, we need to detect other cases when a focus event occurs without
  // a preceding user event (e.g. screen reader focus). Overriding the focus
  // method on HTMLElement.prototype is a bit hacky, but works.
  let focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function () {
    hasEventBeforeFocus = true;
    focus.apply(this, arguments as any);
  };

  document.addEventListener('keydown', handleKeyboardEvent, true);
  document.addEventListener('keyup', handleKeyboardEvent, true);
  document.addEventListener('click', handleClickEvent, true);

  // Register focus events on the window so they are sure to happen
  // before React's event listeners (registered on the document).
  window.addEventListener('focus', handleFocusEvent, true);
  window.addEventListener('blur', handleWindowBlur, false);

  if (typeof PointerEvent !== 'undefined') {
    document.addEventListener('pointerdown', handlePointerEvent, true);
    document.addEventListener('pointermove', handlePointerEvent, true);
    document.addEventListener('pointerup', handlePointerEvent, true);
  } else {
    document.addEventListener('mousedown', handlePointerEvent, true);
    document.addEventListener('mousemove', handlePointerEvent, true);
    document.addEventListener('mouseup', handlePointerEvent, true);
  }

  hasSetupGlobalListeners = true;
}

/**
 * If true, keyboard focus is visible.
 */
function isFocusVisible(): boolean {
  return currentModality !== 'pointer';
}

/**
 * Keyboards, Assistive Technologies, and element.click() all produce a "virtual" click event. This
 * is a method of inferring such clicks. Every browser except IE 11 only sets a zero value of
 * "detail" for click events that are "virtual". However, IE 11 uses a zero value for all click
 * events. For IE 11 we rely on the quirk that it produces click events that are of type
 * PointerEvent, and where only the "virtual" click lacks a pointerType field.
 * @param event
 */
function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  // JAWS/NVDA with Firefox.
  if ((event as any).mozInputSource === 0 && event.isTrusted) {
    return true;
  }

  return event.detail === 0 && !(event as PointerEvent).pointerType;
}

/* -------------------------------------------------------------------------------------------------
 * useFocusImmediate
 * -----------------------------------------------------------------------------------------------*/

/**
 * Handles focus events for the immediate target. Focus events on child elements will be ignored.
 *
 * Adapted from @react-aria/interactions/useFocus
 *
 * @see https://react-spectrum.adobe.com/react-aria/useFocus.html
 */
function useFocusImmediate<T extends Element = Element>(
  props: UseFocusImmediateProps<T>
): UseFocusImmediateResult<T> {
  if (props.disabled) {
    return {
      focusProps: {
        onBlur: undefined,
        onFocus: undefined,
      },
    };
  }

  let onFocus, onBlur;
  if (props.onFocusImmediate || props.onFocusChange) {
    onFocus = function onFocus(event: React.FocusEvent<T>) {
      if (event.target === event.currentTarget) {
        if (props.onFocusImmediate) {
          props.onFocusImmediate(event);
        }

        if (!event.defaultPrevented && props.onFocusChange) {
          props.onFocusChange(true);
        }
      }
    };
  }

  if (props.onBlurImmediate || props.onFocusChange) {
    onBlur = function onBlur(event: React.FocusEvent<T>) {
      if (event.target === event.currentTarget) {
        if (props.onBlurImmediate) {
          props.onBlurImmediate(event);
        }

        if (!event.defaultPrevented && props.onFocusChange) {
          props.onFocusChange(false);
        }
      }
    };
  }

  return {
    focusProps: {
      onFocus,
      onBlur,
    },
  };
}

interface UseFocusImmediateProps<T extends Element = Element> {
  disabled?: boolean;
  /** Handler that is called when the element receives focus. */
  onFocusImmediate?: (e: React.FocusEvent<T>) => void;
  /** Handler that is called when the element loses focus. */
  onBlurImmediate?: (e: React.FocusEvent<T>) => void;
  /** Handler that is called when the element's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void;
}

interface UseFocusImmediateResult<T extends Element = Element> {
  /** Props to spread onto the target element. */
  focusProps: {
    onBlur: React.HTMLAttributes<T>['onBlur'];
    onFocus: React.HTMLAttributes<T>['onFocus'];
  };
}

/* ---------------------------------------------------------------------------------------------- */

function elementMatches(element: Element, selectors: string) {
  return (
    Element.prototype.matches ||
    // @ts-ignore
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector
  ).call(element, selectors);
}

function elementClosest(element: Element, selector: string) {
  if (Element.prototype.closest) {
    return Element.prototype.closest.call(element, selector);
  }

  do {
    if (elementMatches(element, selector)) {
      return element;
    }
    element = element.parentElement || (element.parentNode as Element);
  } while (element !== null && element.nodeType === 1);
  return null;
}

type CheckboxValidationState = 'valid' | 'invalid';

interface AriaValidationProps {
  'aria-errormessage'?: string;
}

interface AriaLabelingProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-details'?: string;
}

interface AriaToggleProps extends AriaLabelingProps, AriaValidationProps {
  'aria-controls'?: string;
}
