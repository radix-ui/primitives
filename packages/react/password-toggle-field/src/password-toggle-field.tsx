import * as React from 'react';
import { flushSync } from 'react-dom';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useId } from '@radix-ui/react-id';
import { useIsHydrated } from '@radix-ui/react-use-is-hydrated';
import { useEffectEvent } from '@radix-ui/react-use-effect-event';
import type { Scope } from '@radix-ui/react-context';
import { createContextScope } from '@radix-ui/react-context';

const PASSWORD_TOGGLE_FIELD_NAME = 'PasswordToggleField';

/* -------------------------------------------------------------------------------------------------
 * PasswordToggleFieldProvider
 * -----------------------------------------------------------------------------------------------*/

type InternalFocusState = {
  clickTriggered: boolean;
  selectionStart: number | null;
  selectionEnd: number | null;
};

interface PasswordToggleFieldContextValue {
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  syncInputId: (providedId: string | number | undefined) => void;
  focusState: React.RefObject<InternalFocusState>;
}

const [createPasswordToggleFieldContext] = createContextScope(PASSWORD_TOGGLE_FIELD_NAME);
const [PasswordToggleFieldProvider, usePasswordToggleFieldContext] =
  createPasswordToggleFieldContext<PasswordToggleFieldContextValue>(PASSWORD_TOGGLE_FIELD_NAME);

/* -------------------------------------------------------------------------------------------------
 * PasswordToggleField
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { __scopePasswordToggleField?: Scope };

interface PasswordToggleFieldProps {
  id?: string;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisiblityChange?: (visible: boolean) => void;
  children?: React.ReactNode;
}

const INITIAL_FOCUS_STATE: InternalFocusState = {
  clickTriggered: false,
  selectionStart: null,
  selectionEnd: null,
};

const PasswordToggleField: React.FC<PasswordToggleFieldProps> = ({
  __scopePasswordToggleField,
  ...props
}: ScopedProps<PasswordToggleFieldProps>) => {
  const baseId = useId(props.id);
  const defaultInputId = `${baseId}-input`;
  const [inputIdState, setInputIdState] = React.useState<null | string>(defaultInputId);
  const inputId = inputIdState ?? defaultInputId;
  const syncInputId = React.useCallback(
    (providedId: string | number | undefined) =>
      setInputIdState(providedId != null ? String(providedId) : null),
    []
  );

  const { visible: visibleProp, defaultVisible, onVisiblityChange, children } = props;
  const [visible = false, setVisible] = useControllableState({
    caller: PASSWORD_TOGGLE_FIELD_NAME,
    prop: visibleProp,
    defaultProp: defaultVisible ?? false,
    onChange: onVisiblityChange,
  });

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const focusState = React.useRef<InternalFocusState>(INITIAL_FOCUS_STATE);

  return (
    <PasswordToggleFieldProvider
      scope={__scopePasswordToggleField}
      inputId={inputId}
      inputRef={inputRef}
      setVisible={setVisible}
      syncInputId={syncInputId}
      visible={visible}
      focusState={focusState}
    >
      {children}
    </PasswordToggleFieldProvider>
  );
};
PasswordToggleField.displayName = PASSWORD_TOGGLE_FIELD_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordToggleFieldInput
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_TOGGLE_FIELD_INPUT_NAME = PASSWORD_TOGGLE_FIELD_NAME + 'Input';

type PrimitiveInputProps = React.ComponentPropsWithoutRef<'input'>;

interface PasswordToggleFieldOwnProps {
  autoComplete?: 'current-password' | 'new-password';
}

interface PasswordToggleFieldInputProps
  extends PasswordToggleFieldOwnProps,
    Omit<PrimitiveInputProps, keyof PasswordToggleFieldOwnProps | 'type'> {
  autoComplete?: 'current-password' | 'new-password';
}

const PasswordToggleFieldInput = React.forwardRef<HTMLInputElement, PasswordToggleFieldInputProps>(
  (
    {
      __scopePasswordToggleField,
      autoComplete = 'current-password',
      autoCapitalize = 'off',
      spellCheck = false,
      id: idProp,
      ...props
    }: ScopedProps<PasswordToggleFieldInputProps>,
    forwardedRef
  ) => {
    const { visible, inputRef, inputId, syncInputId, setVisible, focusState } =
      usePasswordToggleFieldContext(PASSWORD_TOGGLE_FIELD_INPUT_NAME, __scopePasswordToggleField);

    React.useEffect(() => {
      syncInputId(idProp);
    }, [idProp, syncInputId]);

    // We want to reset the visibility to `false` to revert the input to
    // `type="password"` when:
    // - The form is reset (for consistency with other form controls)
    // - The form is submitted (to prevent the browser from remembering the
    //   input's value.
    //
    // See "Keeping things secure":
    //   https://technology.blog.gov.uk/2021/04/19/simple-things-are-complicated-making-a-show-password-option/)
    const _setVisible = useEffectEvent(setVisible);
    React.useEffect(() => {
      const inputElement = inputRef.current;
      const form = inputElement?.form;
      if (!form) {
        return;
      }

      const controller = new AbortController();
      form.addEventListener(
        'reset',
        (event) => {
          if (!event.defaultPrevented) {
            _setVisible(false);
          }
        },
        { signal: controller.signal }
      );
      form.addEventListener(
        'submit',
        () => {
          // always reset the visibility on submit regardless of whether the
          // default action is prevented
          _setVisible(false);
        },
        { signal: controller.signal }
      );
      return () => {
        controller.abort();
      };
    }, [inputRef, _setVisible]);

    return (
      <Primitive.input
        {...props}
        id={idProp ?? inputId}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        ref={useComposedRefs(forwardedRef, inputRef)}
        spellCheck={spellCheck}
        type={visible ? 'text' : 'password'}
        onBlur={composeEventHandlers(props.onBlur, (event) => {
          // get the cursor position
          const { selectionStart, selectionEnd } = event.currentTarget;
          focusState.current.selectionStart = selectionStart;
          focusState.current.selectionEnd = selectionEnd;
        })}
      />
    );
  }
);
PasswordToggleFieldInput.displayName = PASSWORD_TOGGLE_FIELD_INPUT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordToggleFieldToggle
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_TOGGLE_FIELD_TOGGLE_NAME = PASSWORD_TOGGLE_FIELD_NAME + 'Toggle';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;

interface PasswordToggleFieldToggleProps extends Omit<PrimitiveButtonProps, 'type'> {}

const PasswordToggleFieldToggle = React.forwardRef<
  HTMLButtonElement,
  PasswordToggleFieldToggleProps
>(
  (
    {
      __scopePasswordToggleField,
      onClick,
      onPointerDown,
      onPointerCancel,
      onPointerUp,
      onFocus,
      children,
      'aria-label': ariaLabelProp,
      'aria-controls': ariaControls,
      'aria-hidden': ariaHidden,
      tabIndex,
      ...props
    }: ScopedProps<PasswordToggleFieldToggleProps>,
    forwardedRef
  ) => {
    const { setVisible, visible, inputRef, inputId, focusState } = usePasswordToggleFieldContext(
      PASSWORD_TOGGLE_FIELD_TOGGLE_NAME,
      __scopePasswordToggleField
    );
    const [internalAriaLabel, setInternalAriaLabel] = React.useState<string | undefined>(undefined);
    const elementRef = React.useRef<HTMLButtonElement>(null);
    const ref = useComposedRefs(forwardedRef, elementRef);
    const isHydrated = useIsHydrated();

    React.useEffect(() => {
      const element = elementRef.current;
      if (!element || ariaLabelProp) {
        setInternalAriaLabel(undefined);
        return;
      }

      const DEFAULT_ARIA_LABEL = visible ? 'Hide password' : 'Show password';

      function checkForInnerTextLabel(textContent: string | undefined | null) {
        const text = textContent ? textContent : undefined;
        // If the element has inner text, no need to force an aria-label.
        setInternalAriaLabel(text ? undefined : DEFAULT_ARIA_LABEL);
      }

      checkForInnerTextLabel(element.textContent);

      const observer = new MutationObserver((entries) => {
        let textContent: string | undefined;
        for (const entry of entries) {
          if (entry.type === 'characterData') {
            if (element.textContent) {
              textContent = element.textContent;
            }
          }
        }
        checkForInnerTextLabel(textContent);
      });
      observer.observe(element, { characterData: true, subtree: true });
      return () => {
        observer.disconnect();
      };
    }, [visible, ariaLabelProp]);

    const ariaLabel = ariaLabelProp || internalAriaLabel;

    // Before hydration the button will not work, but we want to render it
    // regardless to prevent potential layout shift. Hide it from assistive tech
    // by default. Post-hydration it will be visible, focusable and associated
    // with the input via aria-controls.
    if (!isHydrated) {
      ariaHidden ??= true;
      tabIndex ??= -1;
    } else {
      ariaControls ??= inputId;
    }

    React.useEffect(() => {
      let cleanup = () => {};
      const ownerWindow = elementRef.current?.ownerDocument?.defaultView || window;
      const reset = () => (focusState.current.clickTriggered = false);
      const handlePointerUp = () => (cleanup = requestIdleCallback(ownerWindow, reset));
      ownerWindow.addEventListener('pointerup', handlePointerUp);
      return () => {
        cleanup();
        ownerWindow.removeEventListener('pointerup', handlePointerUp);
      };
    }, [focusState]);

    return (
      <Primitive.button
        aria-controls={ariaControls}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        ref={ref}
        id={inputId}
        {...props}
        onPointerDown={composeEventHandlers(onPointerDown, () => {
          focusState.current.clickTriggered = true;
        })}
        onPointerCancel={(event) => {
          // do not use `composeEventHandlers` here because we always want to
          // reset the ref on cancellation, regardless of whether the user has
          // called preventDefault on the event
          onPointerCancel?.(event);
          focusState.current = INITIAL_FOCUS_STATE;
        }}
        // do not use `composeEventHandlers` here because we always want to
        // reset the ref after click, regardless of whether the user has
        // called preventDefault on the event
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) {
            focusState.current = INITIAL_FOCUS_STATE;
            return;
          }

          flushSync(() => {
            setVisible((s) => !s);
          });
          if (focusState.current.clickTriggered) {
            const input = inputRef.current;
            if (input) {
              const { selectionStart, selectionEnd } = focusState.current;
              input.focus();
              if (selectionStart !== null || selectionEnd !== null) {
                // wait a tick so that focus has settled, then restore select position
                requestAnimationFrame(() => {
                  // make sure the input still has focus (developer may have
                  // programatically moved focus elsewhere)
                  if (input.ownerDocument.activeElement === input) {
                    input.selectionStart = selectionStart;
                    input.selectionEnd = selectionEnd;
                  }
                });
              }
            }
          }
          focusState.current = INITIAL_FOCUS_STATE;
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          // if click handler hasn't been called at this point, it may have been
          // intercepted, in which case we still want to reset our internal
          // state
          setTimeout(() => {
            focusState.current = INITIAL_FOCUS_STATE;
          }, 50);
        }}
        type="button"
      >
        {children}
      </Primitive.button>
    );
  }
);
PasswordToggleFieldToggle.displayName = PASSWORD_TOGGLE_FIELD_TOGGLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordToggleFieldSlot
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_TOGGLE_FIELD_SLOT_NAME = PASSWORD_TOGGLE_FIELD_NAME + 'Slot';

interface PasswordToggleFieldSlotDeclarativeProps {
  visible: React.ReactNode;
  hidden: React.ReactNode;
}

interface PasswordToggleFieldSlotRenderProps {
  render: (args: { visible: boolean }) => React.ReactElement;
}

type PasswordToggleFieldSlotProps =
  | PasswordToggleFieldSlotDeclarativeProps
  | PasswordToggleFieldSlotRenderProps;

const PasswordToggleFieldSlot: React.FC<PasswordToggleFieldSlotProps> = ({
  __scopePasswordToggleField,
  ...props
}: ScopedProps<PasswordToggleFieldSlotProps>) => {
  const { visible } = usePasswordToggleFieldContext(
    PASSWORD_TOGGLE_FIELD_SLOT_NAME,
    __scopePasswordToggleField
  );

  return 'render' in props
    ? //
      props.render({ visible })
    : visible
      ? props.visible
      : props.hidden;
};
PasswordToggleFieldSlot.displayName = PASSWORD_TOGGLE_FIELD_SLOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * PasswordToggleFieldIcon
 * -----------------------------------------------------------------------------------------------*/

const PASSWORD_TOGGLE_FIELD_ICON_NAME = PASSWORD_TOGGLE_FIELD_NAME + 'Icon';

type PrimitiveSvgProps = React.ComponentPropsWithoutRef<'svg'>;

interface PasswordToggleFieldIconProps extends Omit<PrimitiveSvgProps, 'children'> {
  visible: React.ReactElement;
  hidden: React.ReactElement;
}

const PasswordToggleFieldIcon = React.forwardRef<SVGSVGElement, PasswordToggleFieldIconProps>(
  (
    {
      __scopePasswordToggleField,
      // @ts-expect-error
      children,
      ...props
    }: ScopedProps<PasswordToggleFieldIconProps>,
    forwardedRef
  ) => {
    const { visible } = usePasswordToggleFieldContext(
      PASSWORD_TOGGLE_FIELD_ICON_NAME,
      __scopePasswordToggleField
    );
    const { visible: visibleIcon, hidden: hiddenIcon, ...domProps } = props;
    return (
      <Primitive.svg {...domProps} ref={forwardedRef} aria-hidden asChild>
        {visible ? visibleIcon : hiddenIcon}
      </Primitive.svg>
    );
  }
);
PasswordToggleFieldIcon.displayName = PASSWORD_TOGGLE_FIELD_ICON_NAME;

export {
  PasswordToggleField,
  PasswordToggleFieldInput,
  PasswordToggleFieldToggle,
  PasswordToggleFieldSlot,
  PasswordToggleFieldIcon,
  //
  PasswordToggleField as Root,
  PasswordToggleFieldInput as Input,
  PasswordToggleFieldToggle as Toggle,
  PasswordToggleFieldSlot as Slot,
  PasswordToggleFieldIcon as Icon,
};
export type {
  PasswordToggleFieldProps,
  PasswordToggleFieldInputProps,
  PasswordToggleFieldToggleProps,
  PasswordToggleFieldIconProps,
  PasswordToggleFieldSlotProps,
};

function requestIdleCallback(
  window: Window,
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): () => void {
  if ((window as any).requestIdleCallback) {
    const id = window.requestIdleCallback(callback, options);
    return () => {
      window.cancelIdleCallback(id);
    };
  }
  const start = Date.now();
  const id = window.setTimeout(() => {
    const timeRemaining = () => Math.max(0, 50 - (Date.now() - start));
    callback({ didTimeout: false, timeRemaining });
  }, 1);
  return () => {
    window.clearTimeout(id);
  };
}
